import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return req.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    res.cookies.set(name, value, options);
                });
            },
        },
    });
}

export async function middleware(req: NextRequest) {
    // Start with a normal pass-through response.
    const res = NextResponse.next();

    const supabase = createSupabaseMiddlewareClient(req, res);

    // This refreshes the session cookie when needed.
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    const pathname = req.nextUrl.pathname;

    const isProtected =
        pathname.startsWith("/me") || pathname.startsWith("/admin");

    // Avoid redirect loops if your login page lives somewhere else.
    const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/auth");

    if (isProtected && !isAuthPage && !user) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("redirectedFrom", pathname);

        const redirectRes = NextResponse.redirect(loginUrl);

        // Copy any auth cookie updates from res -> redirectRes
        res.cookies.getAll().forEach((c) => {
            redirectRes.cookies.set(c.name, c.value, c);
        });

        return redirectRes;
    }

    return res;
}

// Run middleware on everything except Next static/image assets + common file types.
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
    ],
};
