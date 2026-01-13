import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    const db = await createSupabaseServerClient();
    
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "member_since";
    const order = searchParams.get("order") || "desc";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    try {
        // Build query for member stats
        let query = db
            .from("user_profiles")
            .select(`
                user_id,
                display_name,
                bio,
                avatar_url,
                is_public,
                show_tokens,
                show_activity,
                created_at,
                user_tokens!inner(balance, total_earned),
                follows:follows(count),
                clips:clips(count),
                readings:divination_readings(count)
            `)
            .eq("is_public", true)
            .range(offset, offset + limit - 1);

        // Apply search filter
        if (search) {
            query = query.or(`display_name.ilike.%${search}%,bio.ilike.%${search}%`);
        }

        // Apply sorting
        const validSorts: Record<string, string> = {
            "member_since": "created_at",
            "tokens": "user_tokens.balance",
            "follows": "follows.count",
            "name": "display_name"
        };

        const sortField = validSorts[sortBy] || "created_at";
        query = query.order(sortField, { ascending: order === "asc" });

        const { data, error } = await query;

        if (error) {
            // Fallback to simpler query if complex joins fail
            const { data: simpleData, error: simpleError } = await db
                .from("user_profiles")
                .select(`
                    user_id,
                    display_name,
                    bio,
                    avatar_url,
                    is_public,
                    created_at
                `)
                .eq("is_public", true)
                .ilike("display_name", `%${search}%`)
                .order("created_at", { ascending: order === "asc" })
                .range(offset, offset + limit - 1);

            if (simpleError) {
                return NextResponse.json({ error: simpleError.message }, { status: 500 });
            }

            // Enrich with stats
            const enriched = await Promise.all(
                (simpleData || []).map(async (member) => {
                    const [tokens, follows, clips, readings] = await Promise.all([
                        db.from("user_tokens").select("balance, total_earned").eq("user_id", member.user_id).maybeSingle(),
                        db.from("follows").select("id", { count: "exact" }).eq("user_id", member.user_id),
                        db.from("clips").select("id", { count: "exact" }).eq("user_id", member.user_id),
                        db.from("divination_readings").select("id", { count: "exact" }).eq("user_id", member.user_id)
                    ]);

                    return {
                        ...member,
                        token_balance: tokens.data?.balance || 0,
                        total_tokens_earned: tokens.data?.total_earned || 0,
                        follows_count: follows.count || 0,
                        clips_count: clips.count || 0,
                        readings_count: readings.count || 0
                    };
                })
            );

            return NextResponse.json({ members: enriched, total: enriched.length });
        }

        // Transform data
        const members = (data || []).map((member: any) => ({
            user_id: member.user_id,
            display_name: member.display_name,
            bio: member.bio,
            avatar_url: member.avatar_url,
            member_since: member.created_at,
            token_balance: member.user_tokens?.[0]?.balance || 0,
            total_tokens_earned: member.user_tokens?.[0]?.total_earned || 0,
            follows_count: member.follows?.[0]?.count || 0,
            clips_count: member.clips?.[0]?.count || 0,
            readings_count: member.readings?.[0]?.count || 0
        }));

        // Get total count
        const { count } = await db
            .from("user_profiles")
            .select("*", { count: "exact", head: true })
            .eq("is_public", true);

        return NextResponse.json({
            members,
            total: count || 0,
            limit,
            offset
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch members";
        return NextResponse.json({ error }, { status: 500 });
    }
}
