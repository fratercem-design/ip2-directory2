import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();
    const { id } = await params;

    try {
        // Get profile
        const { data: profile, error: profileError } = await db
            .from("user_profiles")
            .select("*")
            .eq("user_id", id)
            .maybeSingle();

        if (profileError) {
            return NextResponse.json({ error: profileError.message }, { status: 500 });
        }

        // Check if profile is public or if user is viewing their own profile
        if (!profile || (!profile.is_public && (!user || user.id !== id))) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // Get stats
        const [tokens, follows, clips, readings] = await Promise.all([
            db.from("user_tokens").select("balance, total_earned").eq("user_id", id).maybeSingle(),
            db.from("follows").select("id", { count: "exact" }).eq("user_id", id),
            db.from("clips").select("id", { count: "exact" }).eq("user_id", id),
            db.from("divination_readings").select("id", { count: "exact" }).eq("user_id", id)
        ]);

        // Get user email if viewing own profile
        let email: string | undefined;
        if (user && user.id === id) {
            const { data: { user: authUser } } = await db.auth.getUser();
            email = authUser?.email;
        }

        const member = {
            user_id: id,
            display_name: profile.display_name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            member_since: profile.created_at,
            token_balance: tokens.data?.balance || 0,
            total_tokens_earned: tokens.data?.total_earned || 0,
            follows_count: follows.count || 0,
            clips_count: clips.count || 0,
            readings_count: readings.count || 0,
            ...(email && { email })
        };

        return NextResponse.json({ member });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch member";
        return NextResponse.json({ error }, { status: 500 });
    }
}
