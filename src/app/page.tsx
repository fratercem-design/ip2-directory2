
import { supabasePublic } from "@/lib/supabase/public";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { generateStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
    title: "Cult of Psyche - Live Streams, Shadow Work, and Spiritual Community",
    description: "Watch live streams, explore shadow work, join the spiritual community of Cult of Psyche. 24/7 YouTube Live Theater, divination, community discussions, and the path of transformation.",
    keywords: ["Cult of Psyche", "live streams", "shadow work", "spiritual community", "YouTube live", "divination", "transformation"],
    openGraph: {
        title: "Cult of Psyche - Live Streams and Spiritual Community",
        description: "Join the Cult of Psyche community for live streams, shadow work, divination, and authentic transformation.",
        type: "website",
        images: ["/og-image.jpg"]
    }
};

// Helper to deduce embed URL and Chat URL
function getEmbeds(session: any) {
    // 1. LIVE CASE
    if (session && session.is_live) {
        let videoId = "";
        const url = session.stream_url || "";
        if (url.includes("v=")) {
            videoId = url.split("v=")[1].split("&")[0];
        } else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1].split("?")[0];
        }

        const domain = process.env.NEXT_PUBLIC_VERCEL_URL?.replace("https://", "") || "localhost";

        if (videoId) {
            return {
                video: `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`,
                chat: `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${domain}`,
                isLive: true
            };
        }
    }

    // 2. FALLBACK / 24/7 VOD CASE - YouTube Live Theater
    // Playlist of lives and episodes that loops continuously
    // Set this to your YouTube playlist ID containing your lives and episodes
    const playlistId = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID || "PL6NdkXsPL07KN01gH2vucWgLr2QPNnvty";

    // Enhanced YouTube embed for 24/7 theater mode
    // Parameters:
    // - listType=playlist: Specify this is a playlist
    // - list=${playlistId}: Your playlist ID
    // - autoplay=1: Start playing automatically
    // - loop=1: Loop the entire playlist (requires playlist parameter)
    // - playlist=${playlistId}: Required for loop to work with playlists
    // - mute=0: Unmuted (change to 1 for muted)
    // - controls=1: Show player controls
    // - rel=0: Don't show related videos from other channels
    // - modestbranding=1: Minimal YouTube branding
    // - playsinline=1: Play inline on mobile
    // - enablejsapi=1: Enable JavaScript API for advanced control
    return {
        video: `https://www.youtube.com/embed?listType=playlist&list=${playlistId}&autoplay=1&loop=1&playlist=${playlistId}&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3`,
        chat: null,
        isLive: false
    };
}

export default async function Home() {
    const organizationData = generateStructuredData("Organization", {});
    const websiteData = generateStructuredData("WebSite", {});
    const db = supabasePublic();

    // 1. Fetch Cult of Psyche Streamer Data (Always)
    const { data: cop } = await db
        .from("streamers")
        .select(`
        *,
        platform_accounts (
            platform,
            platform_user_id,
            platform_username,
            live_sessions (
                is_live,
                stream_url,
                title,
                viewer_count,
                started_at
            )
        )
    `)
        .eq("slug", "cult-of-psyche")
        .eq("platform_accounts.platform", "youtube")
        .single();

    // 2. Fetch All Active Streams (for the grid)
    const { data: rawSessions } = await db
        .from("live_sessions")
        .select(`
        *,
        platform_accounts (
            platform,
            platform_username,
            streamers (
                id,
                slug,
                display_name,
                avatar_url
            )
        )
    `)
        .eq("is_live", true)
        .order("viewer_count", { ascending: false });

    const sessions = rawSessions || [];

    // Process CoP State
    let heroSession = null;
    let isCoPLive = false;

    if (cop && cop.platform_accounts && cop.platform_accounts[0]) {
        const account = cop.platform_accounts[0];
        const activeSession = account.live_sessions && account.live_sessions.find((s: any) => s.is_live);

        if (activeSession) {
            heroSession = {
                ...activeSession,
                streamer: cop,
                platform_account: account
            };
            isCoPLive = true;
        } else {
            // Construct a "Offline" hero object
            heroSession = {
                title: "Cult of Psyche 24/7 Radio",
                streamer: cop,
                platform_account: account,
                is_live: false
            };
        }
    }

    // Filter CoP out of grid
    const gridSessions = sessions.filter((s: any) => s.platform_accounts.streamers.slug !== 'cult-of-psyche');

    const embeds = getEmbeds(heroSession);

    return (
        <>
            <StructuredData data={organizationData} />
            <StructuredData data={websiteData} />
            <main className="min-h-screen bg-black text-white">
            {heroSession ? (
                // HERO MODE (Always Visible for Cult of Psyche)
                <div className="w-full">
                    <div className={`grid grid-cols-1 ${embeds.chat ? 'lg:grid-cols-[1fr_350px]' : 'lg:grid-cols-1'} gap-0 h-[80vh] border-b border-zinc-800`}>
                        <div className="relative w-full h-full bg-black">
                            <iframe
                                src={embeds.video}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                allowFullScreen
                                title="Cult of Psyche Live Theater"
                                id="youtube-theater-player"
                            />
                            {!embeds.isLive && (
                                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-zinc-700">
                                    <p className="text-white text-sm font-medium">🎭 Live Theater Mode</p>
                                    <p className="text-zinc-400 text-xs">24/7 Episodes & Lives</p>
                                    {/* Hidden easter egg - select this text */}
                                    <p className="text-transparent text-[2px] select-text hover:text-zinc-500 transition-colors cursor-default" title="Look closer...">
                                        The truth is hidden in plain sight. Seek and you shall find.
                                    </p>
                                </div>
                            )}
                        </div>
                        {embeds.chat && (
                            <iframe
                                src={embeds.chat}
                                className="w-full h-full hidden lg:block border-l border-zinc-800 bg-zinc-900"
                                title="Live Chat"
                            />
                        )}
                    </div>

                    {/* Info Bar */}
                    <div className="p-6 bg-zinc-900/50 backdrop-blur border-b border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full border-2 ${isCoPLive ? 'border-red-600' : 'border-zinc-700'} p-0.5`}>
                                <img
                                    src={heroSession.streamer.avatar_url || "/placeholder.png"}
                                    className="w-full h-full rounded-full object-cover bg-zinc-800"
                                    alt={heroSession.streamer.display_name}
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{heroSession.title}</h1>
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    {isCoPLive ? (
                                        <>
                                            <span className="text-red-500 font-bold flex items-center gap-1">
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> LIVE
                                            </span>
                                            <span>•</span>
                                            <span>{heroSession.viewer_count?.toLocaleString() || "0"} watching</span>
                                        </>
                                    ) : (
                                        <span className="text-zinc-500 font-medium">🎭 24/7 Live Theater</span>
                                    )}
                                    <span>•</span>
                                    <span className="font-bold text-white">{heroSession.streamer.display_name}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://cash.app/$psycheawakens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform"
                            >
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">Support</span>
                            </a>
                            <Link
                                href={`/streamer/cult-of-psyche`}
                                className="bg-white text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform"
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                // Use normal header if CoP data missing (fallback)
                <header className="p-8 mb-8 flex items-center justify-between container mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight">Cult of Psyche Live Directory</h1>
                    <div className="text-zinc-500 text-sm">
                        {gridSessions.length} active streams
                    </div>
                </header>
            )}

            {/* REST OF GRID */}
            <div className="container mx-auto p-8">
                <h2 className="text-xl font-bold text-zinc-500 mb-6">Directory</h2>

                {gridSessions.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 border border-zinc-800 rounded-lg bg-zinc-900/20 relative group">
                        No other signals detected.
                        {/* Hidden message on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                            <p className="text-zinc-600 text-xs font-mono">The void holds secrets...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {gridSessions.map((session: any) => (
                            <Link
                                key={session.id}
                                href={`/streamer/${session.platform_accounts.streamers.slug}`}
                                className="group block bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-600 transition-colors"
                            >
                                <div className="aspect-video bg-zinc-800 relative">
                                    {session.thumbnail_url && (
                                        <img
                                            src={session.thumbnail_url}
                                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                            alt={session.title}
                                        />
                                    )}
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                                        LIVE
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                                        {session.viewer_count?.toLocaleString()} viewers
                                    </div>
                                </div>
                                <div className="p-4 flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden">
                                        {session.platform_accounts.streamers.avatar_url && (
                                            <img
                                                src={session.platform_accounts.streamers.avatar_url}
                                                className="w-full h-full object-cover"
                                                alt={session.platform_accounts.streamers.display_name}
                                            />
                                        )}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h2 className="font-bold truncate text-sm mb-0.5 group-hover:text-indigo-400 transition-colors">
                                            {session.title || "Untitled Stream"}
                                        </h2>
                                        <p className="text-xs text-zinc-400">
                                            {session.platform_accounts.streamers.display_name}
                                            <span className="mx-1">•</span>
                                            <span className="capitalize">{session.platform_accounts.platform}</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
        </>
    );
}
