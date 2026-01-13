import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    try {
        const body = await req.json();
        const { ad_id, impression_id, page_path } = body;

        if (!ad_id) {
            return NextResponse.json({ error: "ad_id required" }, { status: 400 });
        }

        // Get client IP and user agent
        const ip_address = req.headers.get("x-forwarded-for") || 
                          req.headers.get("x-real-ip") || 
                          "unknown";
        const user_agent = req.headers.get("user-agent") || "unknown";

        const { data: click, error } = await db
            .from("ad_clicks")
            .insert({
                ad_id,
                impression_id: impression_id || null,
                user_id: user?.id || null,
                page_path: page_path || null,
                ip_address: ip_address.split(",")[0].trim(),
                user_agent
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, click });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid request";
        return NextResponse.json({ error }, { status: 400 });
    }
}
