import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MeDebugPage() {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.getUser();

    const user = data.user;

    const role =
        (user?.app_metadata as any)?.role ??
        (user?.user_metadata as any)?.role ??
        null;

    return (
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px" }}>
            <h1 style={{ fontSize: 28, marginBottom: 12 }}>/me/debug</h1>

            {error ? (
                <pre
                    style={{
                        padding: 12,
                        borderRadius: 8,
                        background: "rgba(0,0,0,0.06)",
                        overflowX: "auto",
                    }}
                >
                    Error: {error.message}
                </pre>
            ) : null}

            <pre
                style={{
                    padding: 12,
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.06)",
                    overflowX: "auto",
                }}
            >
                {JSON.stringify(
                    {
                        authenticated: !!user,
                        id: user?.id ?? null,
                        email: user?.email ?? null,
                        role,
                        app_metadata: user?.app_metadata ?? null,
                    },
                    null,
                    2
                )}
            </pre>
        </div>
    );
}
