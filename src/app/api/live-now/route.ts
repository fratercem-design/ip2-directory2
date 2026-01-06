
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/live-now
// Returns all currently active live sessions.
// Source of Truth: live_sessions.is_live = true
export async function GET() {
    const db = supabaseAdmin();
    const { data, error } = await db
        .from("live_sessions")
        .select(`
      id,
      is_live,
      started_at,
      title,
      viewer_count,
      stream_url,
      thumbnail_url,
      platform_accounts (
        id,
        platform,
        platform_username,
        channel_url,
        streamers (
            id,
            display_name,
            slug,
            avatar_url
        )
      )
    `)
        .eq("is_live", true)
        .order("started_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}
