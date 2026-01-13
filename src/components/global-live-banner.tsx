
"use client";

import { useEffect, useState } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import Link from "next/link";
import { X } from "lucide-react";

export function GlobalLiveBanner() {
    const [isLive, setIsLive] = useState(false);
    const [streamUrl, setStreamUrl] = useState("");
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const db = supabasePublic();

        async function checkLive() {
            // Find Cult of Psyche streamer first (cache ID if possible, but slug is fine)
            // Or simpler: We know the slug is 'cult-of-psyche'.
            // Join live_sessions -> platform_accounts -> streamers
            // But Supabase Client simple join:
            const { data } = await db
                .from("streamers")
                .select(`
                    slug,
                    platform_accounts!inner (
                        live_sessions!inner (
                            is_live,
                            stream_url
                        )
                    )
                `)
                .eq("slug", "cult-of-psyche")
                .eq("platform_accounts.live_sessions.is_live", true)
                .maybeSingle();

            if (data) {
                // Determine URL
                // The shape of data will be nested arrays because of !inner joins usually returning arrays
                // Actually with single() on top it might be clean, but let's safely access.
                interface PlatformAccount {
                    live_sessions?: Array<{ is_live: boolean; stream_url?: string }>;
                }
                const accounts = (data.platform_accounts || []) as PlatformAccount[];
                const sessions = accounts[0]?.live_sessions || [];
                if (sessions[0]?.is_live) {
                    setIsLive(true);
                    setStreamUrl(sessions[0].stream_url || "");
                }
            } else {
                setIsLive(false);
            }
        }

        checkLive();

        // Optional: Subscribe to Realtime for instant update
        // db.channel('live_check').on(...)
        const interval = setInterval(checkLive, 60000); // Check every min
        return () => clearInterval(interval);

    }, []);

    if (!isLive || !visible) return null;

    return (
        <div className="bg-red-600 text-white overflow-hidden relative z-50 h-10 flex items-center">
            <div className="absolute left-0 top-0 bottom-0 z-10 bg-red-600 px-2 flex items-center">
                <button onClick={() => setVisible(false)} className="hover:bg-red-700 p-1 rounded">
                    <X className="w-4 h-4" />
                </button>
            </div>
            {/* Scrolling Marquee */}
            <div className="animate-marquee whitespace-nowrap flex items-center gap-8 px-8 w-full font-bold uppercase tracking-widest text-sm cursor-pointer hover:underline" onClick={() => window.location.href = "/"}>
                <span>🚨 CULT OF PSYCHE IS LIVE! TUNE IN NOW 🚨</span>
                <span>👁️ JOIN THE SIGNAL 👁️</span>
                <span>🚨 CULT OF PSYCHE IS LIVE! TUNE IN NOW 🚨</span>
                <span>👁️ JOIN THE SIGNAL 👁️</span>
                <span>🚨 CULT OF PSYCHE IS LIVE! TUNE IN NOW 🚨</span>
                <span>👁️ JOIN THE SIGNAL 👁️</span>
            </div>
        </div>
    );
}
