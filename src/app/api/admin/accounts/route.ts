
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { z } from "zod";

const schema = z.object({
    streamer_id: z.string().uuid(),
    platform: z.enum(["twitch", "youtube", "kick"]),
    platform_user_id: z.string().min(1),
    platform_username: z.string().optional(),
    channel_url: z.string().optional(),
});

export async function POST(req: Request) {
    const authError = requireAdmin(req);
    if (authError) return authError;

    try {
        const body = await req.json();
        const parsed = schema.parse(body);

        const db = supabaseAdmin();
        const { data, error } = await db.from("platform_accounts").insert(parsed).select().single();

        if (error) throw error;
        return NextResponse.json({ data });

    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Invalid Request" }, { status: 400 });
    }
}
