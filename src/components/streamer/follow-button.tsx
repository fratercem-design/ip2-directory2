
"use client";

import { useEffect, useState } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import { Heart } from "lucide-react";

export function FollowButton({ streamerId }: { streamerId: string }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const db = supabasePublic();

    useEffect(() => {
        checkFollowStatus();
    }, [streamerId]);

    async function checkFollowStatus() {
        const { data: { session } } = await db.auth.getSession();
        if (!session) {
            setUserId(null);
            setLoading(false);
            return;
        }
        setUserId(session.user.id);

        const { data } = await db
            .from("follows")
            .select("streamer_id")
            .eq("streamer_id", streamerId)
            .eq("user_id", session.user.id)
            .maybeSingle();

        setIsFollowing(!!data);
        setLoading(false);
    }

    async function toggleFollow() {
        if (!userId) return alert("Please log in to follow.");

        // Optimistic toggle
        const oldState = isFollowing;
        setIsFollowing(!isFollowing);

        let error;
        if (oldState) {
            // Unfollow
            const { error: e } = await db
                .from("follows")
                .delete()
                .eq("streamer_id", streamerId)
                .eq("user_id", userId);
            error = e;
        } else {
            // Follow
            const { error: e } = await db
                .from("follows")
                .insert({ streamer_id: streamerId, user_id: userId });
            error = e;
        }

        if (error) {
            console.error(error);
            setIsFollowing(oldState); // Revert
            alert("Failed to update follow status.");
        }
    }

    if (loading) return <div className="w-8 h-8 rounded bg-zinc-800 animate-pulse" />;

    return (
        <button
            onClick={toggleFollow}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${isFollowing
                    ? "bg-pink-600/20 text-pink-500 border border-pink-500/50 hover:bg-pink-600/30"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
        >
            <Heart className={`w-4 h-4 ${isFollowing ? "fill-current" : ""}`} />
            {isFollowing ? "Following" : "Follow"}
        </button>
    );
}
