import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const db = await createSupabaseServerClient();
    const { slug } = await params;
    const { data: { user } } = await db.auth.getUser();

    try {
        // Get entry
        const { data: entry, error: entryError } = await db
            .from("glossary_entries")
            .select("*")
            .eq("slug", slug)
            .single();

        if (entryError || !entry) {
            return NextResponse.json({ error: "Entry not found" }, { status: 404 });
        }

        // Record view
        if (user) {
            await db
                .from("glossary_views")
                .insert({
                    entry_id: entry.id,
                    user_id: user.id
                });
        } else {
            await db
                .from("glossary_views")
                .insert({
                    entry_id: entry.id,
                    user_id: null
                });
        }

        // Get related entries
        let relatedEntries: any[] = [];
        if (entry.related_entries && entry.related_entries.length > 0) {
            const { data: related } = await db
                .from("glossary_entries")
                .select("id, title, slug, entry_type, short_description, icon")
                .in("id", entry.related_entries);

            relatedEntries = related || [];
        }

        // Get relationships
        const { data: relationships } = await db
            .from("glossary_relationships")
            .select(`
                relationship_type,
                related_entry:glossary_entries!glossary_relationships_related_entry_id_fkey(id, title, slug, entry_type, short_description, icon)
            `)
            .eq("entry_id", entry.id);

        // Get entries with same category
        const { data: sameCategory } = await db
            .from("glossary_entries")
            .select("id, title, slug, entry_type, icon")
            .eq("category", entry.category)
            .neq("id", entry.id)
            .limit(5);

        return NextResponse.json({
            entry: {
                ...entry,
                related_entries_data: relatedEntries,
                relationships: relationships || [],
                same_category: sameCategory || []
            }
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch entry";
        return NextResponse.json({ error }, { status: 500 });
    }
}
