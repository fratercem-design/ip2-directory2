
"use client";

import { useState } from "react";
import { Bookmark, CheckCircle, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { supabasePublic } from "@/lib/supabase/public";

export function ClipButton({
    streamerId,
    liveSessionId,
    startedAt
}: {
    streamerId: string,
    liveSessionId?: string,
    startedAt?: string
}) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const router = useRouter();
    const pathname = usePathname();

    async function handleClip() {
        if (!liveSessionId) return;

        setStatus("loading");

        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();

        if (!session) {
            // Redirect to login with return path
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
            return;
        }

        // Calculate offset
        let title = "Saved Clip";
        if (startedAt) {
            const start = new Date(startedAt).getTime();
            const now = Date.now();
            const mins = Math.floor((now - start) / 60000);
            title = `Clipped at ${mins}m mark`;
        }

        try {
            const res = await fetch("/api/clips", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}` // Send Token!
                },
                body: JSON.stringify({
                    streamer_id: streamerId,
                    live_session_id: liveSessionId,
                    title,
                    url: window.location.href
                })
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.error);

            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000); // Reset after 3s

        } catch (e: any) {
            alert(e.message);
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    }

    if (!liveSessionId) return null;

    return (
        <button
            onClick={handleClip}
            disabled={status !== "idle"}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${status === "success"
                    ? "bg-green-600/20 text-green-500 border border-green-500/50"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
        >
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> :
                status === "success" ? <CheckCircle className="w-4 h-4" /> :
                    <Bookmark className="w-4 h-4" />}

            {status === "loading" ? "Saving..." :
                status === "success" ? "Saved!" : "Clip Moment"}
        </button>
    );
}
