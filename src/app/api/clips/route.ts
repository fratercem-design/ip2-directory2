
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server"; // Fix import

export async function POST(req: NextRequest) {
    // 1. Auth Check (Simplest way without @supabase/ssr: Check Header)
    // The client should generally send the token, but Supabase Auth cookies are auto-sent.
    // However, validating them with vanilla supabase-js requires setSession.

    // Alternative: Just trust the client-sent User ID? NO.
    // Better: Use `getUser()` by passing the access token from the header.

    // We will ask the Client to send "Authorization: Bearer <token>"? 
    // Or we can rely on the fact that we can't easily validate cookies without @supabase/ssr.

    // FIX: For this MVP, we will use the `getUser` from a new client if we can get the token.
    // But since we didn't setup the client to send tokens in fetch, this is tricky.

    // RETRACTION: The simplest "Hardening" step for Phase 5 without refactoring all Auth to @supabase/ssr
    // is to assume the client sends the user_id and we trust it? ABSOLUTELY NOT.

    // Let's use the standard "get user from cookie" manually if we have to.

    // WAIT. We established `src/lib/supabase/client.ts` (public) and `admin.ts`.
    // We DON'T have `@supabase/ssr`.

    // Workaround: We will update ClipButton to send the `access_token` in the body/header.
    // Then we use `supabase.auth.getUser(token)`.

    // Let's assume the request sends `Authorization: Bearer <token>`.

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return NextResponse.json({ error: "Missing Authorization Header" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { streamer_id, live_session_id, title, url } = body;

        // 2. Validate Session is LIVE (Server Constraint)
        const db = supabaseAdmin();
        const { data: session } = await db
            .from("live_sessions")
            .select("is_live")
            .eq("id", live_session_id)
            .single();

        if (!session || !session.is_live) {
            return NextResponse.json({ error: "Stream is offline or session invalid." }, { status: 400 });
        }

        // 3. Rate Limit (Simple: Max 1 clip per 30 seconds per user)
        const { data: lastClip } = await db
            .from("clips")
            .select("created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (lastClip) {
            const diff = Date.now() - new Date(lastClip.created_at).getTime();
            if (diff < 30000) { // 30s
                return NextResponse.json({ error: "Rate limit: Wait 30s between clips." }, { status: 429 });
            }
        }

        // 4. Create Clip
        const { data, error } = await db
            .from("clips")
            .insert({
                user_id: user.id,
                streamer_id,
                live_session_id,
                title,
                url
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data });

    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Internal Error" }, { status: 500 });
    }
}
