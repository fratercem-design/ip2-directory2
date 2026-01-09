import Link from "next/link";

export default async function AuthCodeErrorPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = (await searchParams) ?? {};
    const error =
        typeof sp.error === "string"
            ? sp.error
            : Array.isArray(sp.error)
                ? sp.error[0]
                : "Authentication failed. Please try again.";

    const description =
        typeof sp.description === "string"
            ? sp.description
            : Array.isArray(sp.description)
                ? sp.description[0]
                : undefined;

    return (
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px" }}>
            <h1 style={{ fontSize: 28, marginBottom: 12 }}>Login Error</h1>
            <p style={{ marginBottom: 16 }}>
                {decodeURIComponent(error)}
            </p>
            {description ? (
                <pre
                    style={{
                        padding: 12,
                        borderRadius: 8,
                        background: "rgba(0,0,0,0.06)",
                        overflowX: "auto",
                        marginBottom: 20,
                    }}
                >
                    {decodeURIComponent(description)}
                </pre>
            ) : null}

            <div style={{ display: "flex", gap: 12 }}>
                <Link href="/" style={{ textDecoration: "underline" }}>
                    Go home
                </Link>
                <Link href="/login" style={{ textDecoration: "underline" }}>
                    Try again
                </Link>
            </div>
        </div>
    );
}
