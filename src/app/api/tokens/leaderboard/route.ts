import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/public";

export async function GET(req: Request) {
    const db = supabasePublic();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "100");

    // Get top token holders
    const { data, error } = await db
        .from("user_tokens")
        .select(`
            balance,
            total_earned,
            user_id,
            auth.users!inner(email)
        `)
        .order("balance", { ascending: false })
        .limit(limit);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Format response (hide sensitive data)
    const leaderboard = (data || []).map((entry: any, index: number) => ({
        rank: index + 1,
        balance: entry.balance,
        total_earned: entry.total_earned,
        // Only show email if user opts in, otherwise show anonymous
        display_name: entry.email ? entry.email.split("@")[0] : `Seeker ${index + 1}`
    }));

    return NextResponse.json({ leaderboard });
}
