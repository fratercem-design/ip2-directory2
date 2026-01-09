
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    // Determine the correct base URL for redirects
    const forwardedHost = request.headers.get("x-forwarded-host");
    const isLocalEnv = process.env.NODE_ENV === "development";
    let baseUrl = origin;

    if (!isLocalEnv && forwardedHost) {
        baseUrl = `https://${forwardedHost}`;
    }

    if (!code) {
        const errUrl = new URL("/auth/auth-code-error", baseUrl);
        errUrl.searchParams.set("error", "Missing auth code.");
        return NextResponse.redirect(errUrl);
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        const errUrl = new URL("/auth/auth-code-error", baseUrl);
        errUrl.searchParams.set("error", error.message);
        return NextResponse.redirect(errUrl);
    }

    return NextResponse.redirect(`${baseUrl}${next}`);
}
