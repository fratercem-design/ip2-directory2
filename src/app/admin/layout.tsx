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
    const allowedEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || [];
    const userEmail = (user.email || "").toLowerCase();

    // Secure by default: If ADMIN_EMAILS is not set or empty, NO ONE gets in.
    // If set, only listed emails get in.
    if (allowedEmails.length === 0 || !allowedEmails.includes(userEmail)) {
        redirect("/admin/access-denied");
    }

    return (
        <div className="admin-layout">
            {children}
        </div>
    );
}
