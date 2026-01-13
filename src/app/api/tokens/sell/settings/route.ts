import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
    const db = await createSupabaseServerClient();

    const { data, error } = await db
        .from("token_sale_settings")
        .select("*")
        .eq("is_enabled", true)
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ 
            error: "Token sales are currently unavailable" 
        }, { status: 503 });
    }

    // Return public settings only
    return NextResponse.json({
        exchange_rate: data.exchange_rate,
        min_sale_amount: data.min_sale_amount,
        max_sale_amount: data.max_sale_amount,
        is_enabled: data.is_enabled
    });
}
