import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const createTestimonialSchema = z.object({
    testimonial: z.string().min(10).max(1000),
    rating: z.number().int().min(1).max(5).optional(),
    display_name: z.string().max(100).optional(),
    tags: z.array(z.enum(["community", "divination", "streams", "philosophy", "growth", "support", "rituals"])).optional()
});

export async function GET(req: Request) {
    const db = await createSupabaseServerClient();
    
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const tag = searchParams.get("tag");

    try {
        let query = db
            .from("testimonials")
            .select(`
                *,
                testimonial_tags(tag),
                user_profiles!inner(display_name, avatar_url)
            `)
            .eq("is_approved", true)
            .eq("status", "approved")
            .order("is_featured", { ascending: false })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (featured) {
            query = query.eq("is_featured", true);
        }

        if (tag) {
            query = query.eq("testimonial_tags.tag", tag);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Transform data
        const testimonials = (data || []).map((t: any) => ({
            id: t.id,
            user_id: t.user_id,
            display_name: t.display_name || t.user_profiles?.display_name || "Anonymous Member",
            avatar_url: t.user_profiles?.avatar_url || null,
            testimonial: t.testimonial,
            rating: t.rating,
            is_featured: t.is_featured,
            tags: (t.testimonial_tags || []).map((tt: any) => tt.tag),
            created_at: t.created_at
        }));

        // Get total count
        let countQuery = db
            .from("testimonials")
            .select("*", { count: "exact", head: true })
            .eq("is_approved", true)
            .eq("status", "approved");

        if (featured) {
            countQuery = countQuery.eq("is_featured", true);
        }

        const { count } = await countQuery;

        return NextResponse.json({
            testimonials,
            total: count || 0,
            limit,
            offset
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch testimonials";
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
        const parsed = createTestimonialSchema.parse(body);

        // Check if user already has a pending or approved testimonial
        const { data: existing } = await db
            .from("testimonials")
            .select("id, status")
            .eq("user_id", user.id)
            .in("status", ["pending", "approved"])
            .maybeSingle();

        if (existing && existing.status === "approved") {
            return NextResponse.json({ 
                error: "You already have an approved testimonial. You can update it if it's still pending." 
            }, { status: 400 });
        }

        // Create testimonial
        let testimonialData: any = {
            user_id: user.id,
            testimonial: parsed.testimonial,
            status: "pending",
            is_approved: false
        };

        if (parsed.rating) {
            testimonialData.rating = parsed.rating;
        }

        if (parsed.display_name) {
            testimonialData.display_name = parsed.display_name;
        }

        const { data: testimonial, error: testimonialError } = await db
            .from("testimonials")
            .upsert(existing ? { ...testimonialData, id: existing.id } : testimonialData, {
                onConflict: "id"
            })
            .select()
            .single();

        if (testimonialError) {
            return NextResponse.json({ error: testimonialError.message }, { status: 500 });
        }

        // Add tags if provided
        if (parsed.tags && parsed.tags.length > 0) {
            // Delete existing tags
            await db.from("testimonial_tags").delete().eq("testimonial_id", testimonial.id);

            // Insert new tags
            const tagsToInsert = parsed.tags.map(tag => ({
                testimonial_id: testimonial.id,
                tag
            }));

            const { error: tagsError } = await db
                .from("testimonial_tags")
                .insert(tagsToInsert);

            if (tagsError) {
                console.error("Failed to insert tags", tagsError);
                // Non-critical, continue
            }
        }

        return NextResponse.json({ 
            success: true, 
            testimonial,
            message: "Testimonial submitted! It will be reviewed before being published."
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid request";
        return NextResponse.json({ error }, { status: 400 });
    }
}
