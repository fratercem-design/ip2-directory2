import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?redirectedFrom=/admin");
    }

    // Email Allowlist Check
    const allowedEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const userEmail = user.email || "";

    // If ADMIN_EMAILS is set, Strictly enforce it.
    // If NOT set, we default to allowing access (assuming the secret inside provides the real security)
    // OR we could fail closed. Given the user instructions, let's allow if env var is missing but warn.
    if (allowedEmails.length > 0 && !allowedEmails.includes(userEmail)) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-zinc-900 border border-red-900/50 p-6 rounded-lg text-center">
                    <h1 className="text-xl font-bold text-red-500 mb-2">Access Denied</h1>
                    <p className="text-zinc-400 mb-4">
                        Your account ({userEmail}) is not authorized to view the admin console.
                    </p>
                    <a href="/" className="text-sm underline hover:text-white">Return Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}
