import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const earnSchema = z.object({
    amount: z.number().int().positive(),
    transaction_type: z.enum([
        'earn_watch_stream',
        'earn_daily_login',
        'earn_follow_streamer',
        'earn_create_clip',
        'earn_share_content',
        'earn_ritual_attendance',
        'earn_community_contribution'
    ]),
    description: z.string().optional(),
    metadata: z.record(z.string(), z.unknown()).optional()
});

export async function POST(req: Request) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = earnSchema.parse(body);

        // Check for duplicate transactions (prevent spam)
        const { data: recent } = await db
            .from("token_transactions")
            .select("id")
            .eq("user_id", user.id)
            .eq("transaction_type", parsed.transaction_type)
            .gte("created_at", new Date(Date.now() - 60000).toISOString()) // Last minute
            .maybeSingle();

        if (recent && parsed.transaction_type !== 'earn_watch_stream') {
            return NextResponse.json({ 
                error: "Please wait before earning tokens for this action again" 
            }, { status: 429 });
        }

        // Create transaction (trigger will update balance)
        const { data: transaction, error } = await db
            .from("token_transactions")
            .insert({
                user_id: user.id,
                amount: parsed.amount,
                transaction_type: parsed.transaction_type,
                description: parsed.description,
                metadata: parsed.metadata || {}
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            transaction,
            message: `Earned ${parsed.amount} tokens!`
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid request";
        return NextResponse.json({ error }, { status: 400 });
    }
}
