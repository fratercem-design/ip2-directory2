
"use client";

import { useEffect, useState } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Video, Bookmark, Coins, Eye } from "lucide-react";
import { TokenDisplay } from "@/components/tokens/token-display";

export default function MyProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [follows, setFollows] = useState<any[]>([]);
    const [clips, setClips] = useState<any[]>([]);
    const [readings, setReadings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const db = supabasePublic();

        async function loadData() {
            const { data: { session } } = await db.auth.getSession();
            if (!session) {
                router.push("/login?next=/me");
                return;
            }
            setUser(session.user);

            // Fetch Follows
            const { data: fData } = await db
                .from("follows")
                .select("created_at, streamers ( slug, display_name, avatar_url )")
                .eq("user_id", session.user.id);
            setFollows(fData || []);

            // Fetch Clips
            const { data: cData } = await db
                .from("clips")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });
            setClips(cData || []);

            // Fetch Readings
            try {
                const res = await fetch("/api/divination/readings?limit=20");
                if (res.ok) {
                    const { readings: rData } = await res.json();
                    setReadings(rData || []);
                }
            } catch (e) {
                // Readings fetch failure is non-critical
            }

            setLoading(false);
        }

        loadData();
    }, []);

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto">
            <header className="mb-12 border-b border-zinc-800 pb-8 relative">
                <Link href="/" className="absolute top-0 left-0 text-zinc-500 hover:text-white flex items-center gap-2 text-sm">
                    <ArrowLeft className="w-4 h-4" /> Home
                </Link>
                <div className="mt-8 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
                        {user?.email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{user?.email}</h1>
                        <p className="text-zinc-500 text-sm">Member since {new Date(user?.created_at).getFullYear()}</p>
                    </div>
                    <TokenDisplay />
                </div>
            </header>

            <div className="space-y-8">
                {/* Tokens Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Coins className="w-5 h-5 text-yellow-400" /> Tokens
                        </h2>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/tokens/sell"
                                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-bold"
                            >
                                Sell Tokens →
                            </Link>
                            <Link
                                href="/me/tokens"
                                className="text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                View Details →
                            </Link>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <TokenDisplay />
                    </div>
                </section>

                <div className="grid md:grid-cols-2 gap-12">
                {/* Follows */}
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Video className="w-5 h-5 text-zinc-500" /> Following ({follows.length})
                    </h2>
                    {follows.length === 0 ? (
                        <div className="p-8 border border-zinc-800 rounded-xl text-center bg-zinc-900/20">
                            <p className="text-zinc-500 mb-4">You aren't following anyone yet.</p>
                            <Link href="/" className="inline-block bg-white text-black text-sm font-bold px-4 py-2 rounded hover:bg-zinc-200">
                                Browse Directory
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {follows.map((f: any, i) => (
                                <Link
                                    href={`/streamer/${f.streamers.slug}`}
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
                                >
                                    {f.streamers.avatar_url ? (
                                        <img src={f.streamers.avatar_url} className="w-8 h-8 rounded-full bg-zinc-800" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                                            {f.streamers.display_name.substring(0, 1)}
                                        </div>
                                    )}
                                    <span className="font-bold">{f.streamers.display_name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Clips */}
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-zinc-500" /> My Clips ({clips.length})
                    </h2>
                    {clips.length === 0 ? (
                        <div className="text-zinc-500 text-sm">
                            No clips saved yet. Watch a live stream to clip moments.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {clips.map((clip) => (
                                <a
                                    key={clip.id}
                                    href={clip.url}
                                    target="_blank"
                                    className="block p-4 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
                                >
                                    <h3 className="font-bold text-sm mb-1">{clip.title}</h3>
                                    <p className="text-xs text-zinc-500">
                                        {new Date(clip.created_at).toLocaleDateString()}
                                    </p>
                                </a>
                            ))}
                        </div>
                    )}
                </section>

                {/* Saved Readings */}
                <section className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Eye className="w-5 h-5 text-purple-400" /> Saved Readings ({readings.length})
                        </h2>
                        <Link
                            href="/divination"
                            className="text-sm text-zinc-400 hover:text-white transition-colors"
                        >
                            New Reading →
                        </Link>
                    </div>
                    {readings.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                            <p className="text-zinc-500 mb-4">No readings saved yet.</p>
                            <Link href="/divination" className="inline-block bg-white text-black text-sm font-bold px-4 py-2 rounded hover:bg-zinc-200">
                                Get Your First Reading
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {readings.map((reading) => (
                                <Link
                                    key={reading.id}
                                    href={`/divination?reading=${reading.id}`}
                                    className="block p-4 rounded bg-zinc-900 border border-zinc-800 hover:border-purple-600/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-sm capitalize">{reading.method} Reading</h3>
                                        <span className="text-xs text-zinc-500">
                                            {new Date(reading.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-400 line-clamp-2">{reading.interpretation}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
            </div>
        </div>
    );
}
