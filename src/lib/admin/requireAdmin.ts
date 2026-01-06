
export function requireAdmin(req: Request): Response | null {
    const secret = process.env.ADMIN_SECRET;
    const got = req.headers.get("x-admin-secret");

    if (!secret) {
        console.error("ADMIN_SECRET not set in environment variables");
        return new Response("Server Configuration Error", { status: 500 });
    }

    if (got !== secret) {
        return new Response("Unauthorized", { status: 401 });
    }

    return null;
}
