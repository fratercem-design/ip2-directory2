
import { supabasePublic } from "@/lib/supabase/public";
import Link from "next/link";

export default async function Home() {
  const db = supabasePublic();

  const { data, error } = await db
    .from("live_sessions")
    .select(`
      id, started_at, title, viewer_count, stream_url, thumbnail_url,
      platform_accounts (
        platform, platform_username, channel_url,
        streamers ( display_name, slug, avatar_url )
      )
    `)
    .eq("is_live", true)
    .order("started_at", { ascending: false });

  if (error) {
    console.error("Live fetch error:", error);
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Error loading directory</h1>
        <pre className="text-red-400 text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">IP2 Live Directory</h1>
        <div className="text-zinc-500 text-sm">
          {(data ?? []).length} active streams
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(data ?? []).map((row: any) => {
          const streamer = row.platform_accounts?.streamers;
          const account = row.platform_accounts;

          return (
            <div key={row.id} className="border border-zinc-800 bg-zinc-900/50 rounded-lg overflow-hidden hover:border-zinc-700 transition-colors">
              <div className="aspect-video bg-zinc-800 relative">
                {row.thumbnail_url ? (
                  <img src={row.thumbnail_url} alt={row.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-sm">NO SIGNAL</div>
                )}
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Live
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight truncate">{streamer?.display_name || 'Unknown Streamer'}</h3>
                    <p className="text-zinc-400 text-sm capitalize flex items-center gap-2">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono uppercase">{account?.platform}</span>
                      {account?.platform_username}
                    </p>
                  </div>
                  {streamer?.avatar_url && (
                    <img src={streamer.avatar_url} className="w-10 h-10 rounded-full bg-zinc-800" />
                  )}
                </div>

                <div className="text-sm text-zinc-300 line-clamp-2 min-h-[2.5rem]">
                  {row.title || 'No title set'}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-zinc-500">
                  <span>{row.viewer_count?.toLocaleString() ?? 0} watching</span>
                  <span>Started {new Date(row.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {row.stream_url && (
                  <a href={row.stream_url} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 bg-white text-black font-bold rounded hover:bg-zinc-200 transition-colors">
                    Watch Stream
                  </a>
                )}
              </div>
            </div>
          )
        })}

        {(data ?? []).length === 0 && (
          <div className="col-span-full py-20 text-center text-zinc-500">
            <div className="text-4xl mb-4">💤</div>
            <p>No active signals detected.</p>
          </div>
        )}
      </div>
    </main>
  );
}
