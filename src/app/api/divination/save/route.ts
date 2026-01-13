import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const saveSchema = z.object({
    method: z.enum(["tarot", "oracle", "lineage", "serpent"]),
    cards: z.array(z.object({
        name: z.string(),
        meaning: z.string(),
        position: z.string()
    })),
    interpretation: z.string()
});

export async function POST(req: Request) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const parsed = saveSchema.parse(body);

        const { data, error } = await db
            .from("divination_readings")
            .insert({
                user_id: user.id,
                method: parsed.method,
                cards: parsed.cards,
                interpretation: parsed.interpretation
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, reading: data });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Invalid request";
        return NextResponse.json({ error }, { status: 400 });
    }
}
