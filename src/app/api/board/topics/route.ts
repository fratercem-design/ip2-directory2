import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const createTopicSchema = z.object({
    category_id: z.string().uuid(),
    title: z.string().min(3).max(200),
    content: z.string().min(10)
});

export async function GET(req: Request) {
    const db = await createSupabaseServerClient();
    
    const { searchParams } = new URL(req.url);
    const category_id = searchParams.get("category_id");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    try {
        let query = db
            .from("board_topics")
            .select(`
                *,
                user_profiles!board_topics_user_id_fkey(display_name, avatar_url),
                board_categories!inner(name, slug, icon, color),
                last_reply_user:user_profiles!board_topics_last_reply_by_fkey(display_name)
            `)
            .order("is_pinned", { ascending: false })
            .order("last_reply_at", { ascending: false, nullsFirst: false })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (category_id) {
            query = query.eq("category_id", category_id);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Transform data
        const topics = (data || []).map((topic: any) => ({
            id: topic.id,
            category_id: topic.category_id,
            category: {
                name: topic.board_categories.name,
                slug: topic.board_categories.slug,
                icon: topic.board_categories.icon,
                color: topic.board_categories.color
            },
            user_id: topic.user_id,
            author: {
                display_name: topic.user_profiles?.display_name || "Anonymous",
                avatar_url: topic.user_profiles?.avatar_url || null
            },
            title: topic.title,
            content: topic.content,
            is_pinned: topic.is_pinned,
            is_locked: topic.is_locked,
            view_count: topic.view_count,
            reply_count: topic.reply_count,
            last_reply_at: topic.last_reply_at,
            last_reply_by: topic.last_reply_user?.display_name || null,
            created_at: topic.created_at,
            updated_at: topic.updated_at
        }));

        // Get total count
        let countQuery = db
            .from("board_topics")
            .select("*", { count: "exact", head: true });

        if (category_id) {
            countQuery = countQuery.eq("category_id", category_id);
        }

        const { count } = await countQuery;

        return NextResponse.json({
            topics,
            total: count || 0,
            limit,
            offset
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch topics";
        return NextResponse.json({ error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = createTopicSchema.parse(body);

        const { data: topic, error } = await db
            .from("board_topics")
            .insert({
                category_id: parsed.category_id,
                user_id: user.id,
                title: parsed.title,
                content: parsed.content
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            topic,
            message: "Topic created successfully!"
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid request";
        return NextResponse.json({ error }, { status: 400 });
    }
}
