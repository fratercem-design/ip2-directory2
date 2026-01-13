import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const sellSchema = z.object({
    tokens_amount: z.number().int().positive(),
    payment_method: z.enum(["cashapp", "paypal", "venmo", "other"]),
    payment_info: z.string().min(1)
});

export async function POST(req: Request) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = sellSchema.parse(body);

        // Get sale settings
        const { data: settings, error: settingsError } = await db
            .from("token_sale_settings")
            .select("*")
            .eq("is_enabled", true)
            .maybeSingle();

        if (settingsError || !settings) {
            return NextResponse.json({ 
                error: "Token sales are currently unavailable" 
            }, { status: 503 });
        }

        // Validate amount
        if (parsed.tokens_amount < settings.min_sale_amount) {
            return NextResponse.json({ 
                error: `Minimum sale amount is ${settings.min_sale_amount} tokens` 
            }, { status: 400 });
        }

        if (settings.max_sale_amount && parsed.tokens_amount > settings.max_sale_amount) {
            return NextResponse.json({ 
                error: `Maximum sale amount is ${settings.max_sale_amount} tokens` 
            }, { status: 400 });
        }

        // Check user balance
        const { data: tokenData, error: tokenError } = await db
            .from("user_tokens")
            .select("balance")
            .eq("user_id", user.id)
            .maybeSingle();

        if (tokenError) {
            return NextResponse.json({ error: tokenError.message }, { status: 500 });
        }

        const balance = tokenData?.balance || 0;
        if (balance < parsed.tokens_amount) {
            return NextResponse.json({ 
                error: `Insufficient balance. You have ${balance} tokens` 
            }, { status: 400 });
        }

        // Calculate sale price
        const salePriceUsd = parsed.tokens_amount / settings.exchange_rate;

        // Create sale request
        const { data: sale, error: saleError } = await db
            .from("token_sales")
            .insert({
                user_id: user.id,
                tokens_amount: parsed.tokens_amount,
                sale_price_usd: salePriceUsd,
                exchange_rate: settings.exchange_rate,
                payment_method: parsed.payment_method,
                payment_info: parsed.payment_info,
                status: "pending"
            })
            .select()
            .single();

        if (saleError) {
            return NextResponse.json({ error: saleError.message }, { status: 500 });
        }

        // Reserve tokens by creating a pending transaction
        // This will be finalized when sale is approved
        const { error: transactionError } = await db
            .from("token_transactions")
            .insert({
                user_id: user.id,
                amount: -parsed.tokens_amount, // Negative = spending
                transaction_type: "transfer",
                description: `Token sale request #${sale.id.substring(0, 8)}`,
                metadata: {
                    sale_id: sale.id,
                    status: "pending",
                    sale_price_usd: salePriceUsd
                }
            });

        if (transactionError) {
            // Rollback sale if transaction fails
            await db.from("token_sales").delete().eq("id", sale.id);
            return NextResponse.json({ error: transactionError.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            sale,
            message: `Sale request created. You will receive $${salePriceUsd.toFixed(2)} when approved.`
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid request";
        return NextResponse.json({ error }, { status: 400 });
    }
}
