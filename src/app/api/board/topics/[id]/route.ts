import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const db = await createSupabaseServerClient();
    const { id } = await params;
    const { data: { user } } = await db.auth.getUser();

    try {
        // Get topic
        const { data: topic, error: topicError } = await db
            .from("board_topics")
            .select(`
                *,
                user_profiles!board_topics_user_id_fkey(display_name, avatar_url),
                board_categories!inner(name, slug, icon, color)
            `)
            .eq("id", id)
            .single();

        if (topicError || !topic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }

        // Record view (if authenticated)
        if (user) {
            await db
                .from("topic_views")
                .upsert({
                    topic_id: id,
                    user_id: user.id
                }, {
                    onConflict: "topic_id,user_id"
                });
        } else {
            // Anonymous view
            await db
                .from("topic_views")
                .insert({
                    topic_id: id,
                    user_id: null
                });
        }

        // Get posts
        const { data: posts, error: postsError } = await db
            .from("board_posts")
            .select(`
                *,
                user_profiles!board_posts_user_id_fkey(display_name, avatar_url)
            `)
            .eq("topic_id", id)
            .order("created_at", { ascending: true });

        if (postsError) {
            return NextResponse.json({ error: postsError.message }, { status: 500 });
        }

        // Get reactions
        const { data: topicReactions } = await db
            .from("topic_reactions")
            .select("reaction_type, user_id")
            .eq("topic_id", id);

        const { data: postReactions } = await db
            .from("post_reactions")
            .select("post_id, reaction_type, user_id")
            .in("post_id", (posts || []).map((p: any) => p.id));

        // Transform data
        const transformedTopic = {
            ...topic,
            category: {
                name: topic.board_categories.name,
                slug: topic.board_categories.slug,
                icon: topic.board_categories.icon,
                color: topic.board_categories.color
            },
            author: {
                display_name: topic.user_profiles?.display_name || "Anonymous",
                avatar_url: topic.user_profiles?.avatar_url || null
            },
            reactions: (topicReactions || []).reduce((acc: any, r: any) => {
                if (!acc[r.reaction_type]) acc[r.reaction_type] = [];
                acc[r.reaction_type].push(r.user_id);
                return acc;
            }, {})
        };

        const transformedPosts = (posts || []).map((post: any) => ({
            ...post,
            author: {
                display_name: post.user_profiles?.display_name || "Anonymous",
                avatar_url: post.user_profiles?.avatar_url || null
            },
            reactions: (postReactions || [])
                .filter((r: any) => r.post_id === post.id)
                .reduce((acc: any, r: any) => {
                    if (!acc[r.reaction_type]) acc[r.reaction_type] = [];
                    acc[r.reaction_type].push(r.user_id);
                    return acc;
                }, {})
        }));

        return NextResponse.json({
            topic: transformedTopic,
            posts: transformedPosts
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch topic";
        return NextResponse.json({ error }, { status: 500 });
    }
}
