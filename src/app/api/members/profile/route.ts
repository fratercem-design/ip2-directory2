import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const profileSchema = z.object({
    display_name: z.string().min(1).max(100).optional(),
    bio: z.string().max(500).optional().nullable(),
    avatar_url: z.string().url().optional().nullable(),
    is_public: z.boolean().optional(),
    show_tokens: z.boolean().optional(),
    show_activity: z.boolean().optional()
});

export async function GET() {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await db
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return profile or create default
    if (!data) {
        return NextResponse.json({
            profile: {
                user_id: user.id,
                display_name: null,
                bio: null,
                avatar_url: null,
                is_public: true,
                show_tokens: false,
                show_activity: true
            }
        });
    }

    return NextResponse.json({ profile: data });
}

export async function PUT(req: Request) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = profileSchema.parse(body);

        // Check if profile exists
        const { data: existing } = await db
            .from("user_profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

        let result;
        if (existing) {
            // Update existing profile
            const { data, error } = await db
                .from("user_profiles")
                .update({
                    ...parsed,
                    updated_at: new Date().toISOString()
                })
                .eq("user_id", user.id)
                .select()
                .single();

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            result = data;
        } else {
            // Create new profile
            const { data, error } = await db
                .from("user_profiles")
                .insert({
                    user_id: user.id,
                    ...parsed
                })
                .select()
                .single();

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            result = data;
        }

        return NextResponse.json({ success: true, profile: result });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid request";
        return NextResponse.json({ error }, { status: 400 });
    }
}
