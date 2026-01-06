
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { z } from "zod";

const schema = z.object({
    display_name: z.string().min(1),
    slug: z.string().min(1),
    avatar_url: z.string().optional(),
    bio: z.string().optional(),
});

export async function POST(req: Request) {
    const authError = requireAdmin(req);
    if (authError) return authError;

    try {
        const body = await req.json();
        const parsed = schema.parse(body);

        // Check slug uniqueness
        const db = supabaseAdmin();
        const { data: existing } = await db.from("streamers").select("id").eq("slug", parsed.slug).maybeSingle();

        if (existing) {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }

        const { data, error } = await db.from("streamers").insert(parsed).select().single();

        if (error) throw error;
        return NextResponse.json({ data });

    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Invalid Request" }, { status: 400 });
    }
}
