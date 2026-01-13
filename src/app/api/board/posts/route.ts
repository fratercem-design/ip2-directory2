import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const createPostSchema = z.object({
    topic_id: z.string().uuid(),
    content: z.string().min(10)
});

export async function POST(req: Request) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = createPostSchema.parse(body);

        // Check if topic exists and is not locked
        const { data: topic, error: topicError } = await db
            .from("board_topics")
            .select("id, is_locked")
            .eq("id", parsed.topic_id)
            .single();

        if (topicError || !topic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }

        if (topic.is_locked) {
            return NextResponse.json({ error: "This topic is locked" }, { status: 403 });
        }

        const { data: post, error } = await db
            .from("board_posts")
            .insert({
                topic_id: parsed.topic_id,
                user_id: user.id,
                content: parsed.content
            })
            .select(`
                *,
                user_profiles!board_posts_user_id_fkey(display_name, avatar_url)
            `)
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            post: {
                ...post,
                author: {
                    display_name: post.user_profiles?.display_name || "Anonymous",
                    avatar_url: post.user_profiles?.avatar_url || null
                }
            },
            message: "Reply posted successfully!"
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid request";
        return NextResponse.json({ error }, { status: 400 });
    }
}
