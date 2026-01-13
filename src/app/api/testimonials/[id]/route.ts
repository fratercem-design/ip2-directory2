import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const db = await createSupabaseServerClient();
    const { id } = await params;

    try {
        const { data: testimonial, error } = await db
            .from("testimonials")
            .select(`
                *,
                user_profiles!testimonials_user_id_fkey(display_name, avatar_url)
            `)
            .eq("id", id)
            .eq("is_approved", true)
            .eq("status", "approved")
            .single();

        if (error || !testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        // Get tags
        const { data: tags } = await db
            .from("testimonial_tags")
            .select("tag")
            .eq("testimonial_id", id);

        const transformed = {
            ...testimonial,
            display_name: testimonial.display_name || testimonial.user_profiles?.display_name || "Anonymous Member",
            avatar_url: testimonial.user_profiles?.avatar_url || null,
            tags: (tags || []).map((t: any) => t.tag)
        };

        return NextResponse.json({ testimonial: transformed });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch testimonial";
        return NextResponse.json({ error }, { status: 500 });
    }
}
