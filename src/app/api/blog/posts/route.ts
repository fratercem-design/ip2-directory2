import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    const db = await createSupabaseServerClient();
    
    const { searchParams } = new URL(req.url);
    const post_type = searchParams.get("type");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    try {
        let query = db
            .from("blog_posts")
            .select("*")
            .eq("is_published", true)
            .order("published_at", { ascending: false })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (post_type) {
            query = query.eq("post_type", post_type);
        }

        if (category) {
            query = query.eq("category", category);
        }

        if (featured) {
            query = query.eq("is_featured", true);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get total count
        let countQuery = db
            .from("blog_posts")
            .select("*", { count: "exact", head: true })
            .eq("is_published", true);

        if (post_type) {
            countQuery = countQuery.eq("post_type", post_type);
        }

        if (category) {
            countQuery = countQuery.eq("category", category);
        }

        if (featured) {
            countQuery = countQuery.eq("is_featured", true);
        }

        const { count } = await countQuery;

        return NextResponse.json({
            posts: data || [],
            total: count || 0,
            limit,
            offset
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch posts";
        return NextResponse.json({ error }, { status: 500 });
    }
}
