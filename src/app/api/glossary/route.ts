import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    const db = await createSupabaseServerClient();
    
    const { searchParams } = new URL(req.url);
    const entry_type = searchParams.get("type");
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    try {
        let query = db
            .from("glossary_entries")
            .select("*")
            .order("is_featured", { ascending: false })
            .order("view_count", { ascending: false })
            .order("title", { ascending: true })
            .range(offset, offset + limit - 1);

        if (entry_type) {
            query = query.eq("entry_type", entry_type);
        }

        if (category) {
            query = query.eq("category", category);
        }

        if (tag) {
            query = query.contains("tags", [tag]);
        }

        if (featured) {
            query = query.eq("is_featured", true);
        }

        if (search) {
            // Full-text search
            query = query.textSearch("title,short_description,full_description", search, {
                type: "websearch",
                config: "english"
            });
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get total count
        let countQuery = db
            .from("glossary_entries")
            .select("*", { count: "exact", head: true });

        if (entry_type) {
            countQuery = countQuery.eq("entry_type", entry_type);
        }

        if (category) {
            countQuery = countQuery.eq("category", category);
        }

        if (tag) {
            countQuery = countQuery.contains("tags", [tag]);
        }

        if (featured) {
            countQuery = countQuery.eq("is_featured", true);
        }

        const { count } = await countQuery;

        return NextResponse.json({
            entries: data || [],
            total: count || 0,
            limit,
            offset
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch entries";
        return NextResponse.json({ error }, { status: 500 });
    }
}
