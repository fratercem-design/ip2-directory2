import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await db
        .from("testimonials")
        .select(`
            *,
            testimonial_tags(tag)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const testimonials = (data || []).map((t: any) => ({
        ...t,
        tags: (t.testimonial_tags || []).map((tt: any) => tt.tag)
    }));

    return NextResponse.json({ testimonials });
}
