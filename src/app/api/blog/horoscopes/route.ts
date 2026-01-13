import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    const db = await createSupabaseServerClient();
    
    const { searchParams } = new URL(req.url);
    const sign = searchParams.get("sign");
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const limit = parseInt(searchParams.get("limit") || "12");

    try {
        let query = db
            .from("horoscopes")
            .select("*")
            .eq("date", date)
            .order("sign", { ascending: true });

        if (sign) {
            query = query.eq("sign", sign);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // If no horoscopes for today, return empty
        return NextResponse.json({
            horoscopes: data || [],
            date,
            total: data?.length || 0
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch horoscopes";
        return NextResponse.json({ error }, { status: 500 });
    }
}
