import { supabasePublic } from "@/lib/supabase/public";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Twitch, Youtube, Video } from "lucide-react";
import { FollowButton } from "@/components/streamer/follow-button";
import { ClipButton } from "@/components/streamer/clip-button";

// Helper to get platform icon
const PlatformIcon = ({ p }: { p: string }) => {
    switch (p) {
        case 'twitch': return <Twitch className="h-4 w-4" />;
        case 'youtube': return <Youtube className="h-4 w-4" />;
        default: return <Video className="h-4 w-4" />;
    }
};

export default async function StreamerProfile({ params }: { params: { slug: string } }) {
    const db = supabasePublic();
    const { slug } = params;

    const { data: streamer } = await db
        .from("streamers")
        .select(`
            *,
            platform_accounts (
                platform,
                platform_username,
                channel_url,
                is_enabled
            )
        `)
        .eq("slug", slug)
        .single();

    if (!streamer) return notFound();

    // Check if live
    const { data: liveSession } = await db
        .from("live_sessions")
        .select("*")
        .eq("is_live", true)
        .eq("streamer_id", streamer.id) // This requires the join valid in DB schema or logic fix
    // Wait, schema: live_sessions -> platform_accounts -> streamers. 
    // We can't query live_sessions by streamer_id directly unless we added that column like User suggested in Phase 1 walkthru?
    // User's Phase 1 Walkthru schema had: `streamer_id uuid not null references public.streamers(id)` in live_sessions!
    // My Phase 1 Plan had: `platform_account_id`.
    // I implemented `platform_account_id`. 
    // So I must join.

    // Correct Query:
    // We already have platform_accounts loaded. We can check if any of them have an active session.
    // Or we query live_sessions where platform_account_id IN (streamer.platform_accounts.ids)

    const accountIds = streamer.platform_accounts.map((a: any) => a.id); // This select above didn't return IDs! Fixing select.

    // Re-fetch logic or optimize. Let's do a second query for simplicity.
    const { data: accounts } = await db.from("platform_accounts").select("id").eq("streamer_id", streamer.id);
    const ids = accounts?.map(a => a.id) || [];

    const { data: session } = await db
        .from("live_sessions")
        .select("*")
        .in("platform_account_id", ids)
        .eq("is_live", true)
        .maybeSingle();

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Directory
            </Link>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12">
                {/* Sidebar / Bio */}
                <div className="space-y-6">
                    <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                        {streamer.avatar_url ? (
                            <img src={streamer.avatar_url} alt={streamer.display_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700 text-4xl font-bold uppercase">
                                {streamer.display_name.substring(0, 2)}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{streamer.display_name}</h1>
                            <p className="text-zinc-400 leading-relaxed text-sm">{streamer.bio || "No biography provided."}</p>
                        </div>

                        <div className="flex gap-2">
                            <FollowButton streamerId={streamer.id} />
                            {session && <ClipButton streamerId={streamer.id} liveSessionId={session.id} startedAt={session.started_at} />}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Connect</h3>
                        <div className="flex flex-col gap-2">
                            {streamer.platform_accounts.map((acc: any) => (
                                <a
                                    key={acc.platform}
                                    href={acc.channel_url || "#"}
                                    target="_blank"
                                    className="flex items-center gap-3 p-3 rounded bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800/50"
                                >
                                    <PlatformIcon p={acc.platform} />
                                    <span className="capitalize">{acc.platform}</span>
                                    {acc.platform_username && <span className="text-zinc-500 text-sm ml-auto">{acc.platform_username}</span>}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content / Live Status */}
                <div className="space-y-8">
                    {session ? (
                        <div className="rounded-xl overflow-hidden border border-red-900/50 bg-zinc-900/30">
                            <div className="bg-red-600 px-4 py-2 text-white font-bold text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                LIVE NOW
                            </div>
                            <div className="aspect-video bg-black relative">
                                {session.thumbnail_url && <img src={session.thumbnail_url} className="w-full h-full object-cover opacity-50" />}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <a
                                        href={session.stream_url}
                                        target="_blank"
                                        className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                                    >
                                        Watch on {session.raw?.platform_name || "Platform"}
                                    </a>
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-2">{session.title}</h2>
                                <div className="text-zinc-400 flex items-center gap-4 text-sm">
                                    <span>{session.viewer_count?.toLocaleString()} watching</span>
                                    <span>Started {new Date(session.started_at).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-12 rounded-xl border border-zinc-800 bg-zinc-900/20 text-center space-y-4">
                            <div className="text-4xl">💤</div>
                            <h2 className="text-xl font-bold text-zinc-300">Currently Offline</h2>
                            <p className="text-zinc-500">Check back later or follow on social platforms.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
