
"use client";

import { useEffect, useState } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Video, Bookmark } from "lucide-react";

export default function MyProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [follows, setFollows] = useState<any[]>([]);
    const [clips, setClips] = useState<any[]>([]);
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
                    <div>
                        <h1 className="text-2xl font-bold">{user?.email}</h1>
                        <p className="text-zinc-500 text-sm">Member since {new Date(user?.created_at).getFullYear()}</p>
                    </div>
                </div>
            </header>

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
            </div>
        </div>
    );
}
