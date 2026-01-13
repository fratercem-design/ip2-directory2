import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await db
        .from("user_tokens")
        .select("balance, total_earned, total_spent")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no record exists, create one with 0 balance
    if (!data) {
        const { data: newData, error: insertError } = await db
            .from("user_tokens")
            .insert({ user_id: user.id, balance: 0 })
            .select("balance, total_earned, total_spent")
            .single();

        if (insertError) {
            return NextResponse.json({ error: insertError.message }, { status: 500 });
        }

        return NextResponse.json(newData);
    }

    return NextResponse.json(data);
}
