
import type { AccountDue, BatchFetchResult, LiveSnapshot } from "./types";

// Strategies:
// 1. RSS Feed (Free): Check https://www.youtube.com/feeds/videos.xml?channel_id={id}
//    - If latest entry is < 3 hours old, it MIGHT be a stream.
// 2. Videos API (Cost: 1 unit): https://www.googleapis.com/youtube/v3/videos?id={id}&part=liveStreamingDetails,snippet
//    - Confirm if actually live.

const YOUTUBE_KEY = process.env.YOUTUBE_API_KEY;
const RSS_CONCURRENCY = 10;
const RECENT_THRESHOLD_MS = 3 * 60 * 60 * 1000; // 3 hours

async function getLatestVideoFromRSS(channelId: string): Promise<{ videoId: string, published: number } | null> {
    try {
        const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
            next: { revalidate: 60 }, // Cache briefly
            headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }
        });

        if (!res.ok) return null;

        const text = await res.text();

        // Simple regex parse to avoid heavy XML deps
        // Look for the first <entry>
        const entryMatch = text.match(/<entry>([\s\S]*?)<\/entry>/);
        if (!entryMatch) return null;

        const entry = entryMatch[1];

        const idMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
        const publishedMatch = entry.match(/<published>(.*?)<\/published>/);

        if (idMatch && publishedMatch) {
            return {
                videoId: idMatch[1],
                published: new Date(publishedMatch[1]).getTime()
            };
        }

        return null;
    } catch (e) {
        console.warn(`YouTube RSS Fail (${channelId})`, e);
        return null;
    }
}

export async function fetchYouTubeLive(accounts: AccountDue[]): Promise<BatchFetchResult> {
    if (!YOUTUBE_KEY) {
        console.error("Missing YOUTUBE_API_KEY");
        return { byPlatformUserId: {}, errors: [] };
    }

    if (accounts.length === 0) return { byPlatformUserId: {} };

    // 1. Check RSS feeds in parallel (Filter step)
    const candidates: { account: AccountDue, videoId: string }[] = [];
    const results: Record<string, LiveSnapshot> = {};
    const errors: BatchFetchResult['errors'] = [];

    // Chunking for RSS requests
    const chunks = [];
    for (let i = 0; i < accounts.length; i += RSS_CONCURRENCY) {
        chunks.push(accounts.slice(i, i + RSS_CONCURRENCY));
    }

    for (const chunk of chunks) {
        await Promise.all(chunk.map(async (acc) => {
            // If we have a known "last check" and it failed recently, maybe skip? 
            // For now, always check RSS (it's cheap/free).
            const latest = await getLatestVideoFromRSS(acc.platform_user_id);

            if (latest) {
                const age = Date.now() - latest.published;
                if (age < RECENT_THRESHOLD_MS) {
                    candidates.push({ account: acc, videoId: latest.videoId });
                } else {
                    // Latest video is old -> Offline
                    results[acc.platform_user_id] = {
                        platform_user_id: acc.platform_user_id,
                        is_live: false,
                        raw: null
                    };
                }
            } else {
                // RSS failed or empty -> treat as offline or error?
                // For safety, assume offline unless we want to burn quota.
                results[acc.platform_user_id] = {
                    platform_user_id: acc.platform_user_id,
                    is_live: false,
                    raw: null
                };
            }
        }));
    }

    // 2. Verify Candidates with API (Cost: 1 unit per 50 videos)
    if (candidates.length > 0) {
        // Group candidates into batches of 50 (API limit)
        const apiBatches = [];
        for (let i = 0; i < candidates.length; i += 50) {
            apiBatches.push(candidates.slice(i, i + 50));
        }

        for (const batch of apiBatches) {
            const ids = batch.map(c => c.videoId).join(",");
            const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${ids}&key=${YOUTUBE_KEY}`;

            try {
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`YouTube API ${res.status}`);
                }

                const data = await res.json();

                // Map API results
                for (const item of (data.items || [])) {
                    const candidate = batch.find(c => c.videoId === item.id);
                    if (!candidate) continue;

                    const liveDetails = item.liveStreamingDetails;
                    const isLive = liveDetails && !liveDetails.actualEndTime && !!liveDetails.actualStartTime;

                    // Update result
                    results[candidate.account.platform_user_id] = {
                        platform_user_id: candidate.account.platform_user_id,
                        is_live: isLive,
                        started_at: liveDetails?.actualStartTime,
                        title: item.snippet?.title,
                        category: item.snippet?.categoryId, // ID only, simpler than mapping text
                        viewer_count: parseInt(liveDetails?.concurrentViewers || "0"),
                        stream_url: `https://youtube.com/watch?v=${item.id}`,
                        thumbnail_url: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
                        raw: item
                    };
                }
            } catch (e: any) {
                console.error("YouTube API Batch Error:", e);
                batch.forEach(c => errors.push({ platform_user_id: c.account.platform_user_id, message: e.message }));
            }
        }
    }

    // Fill in any gaps (candidates that didn't return valid API data)
    for (const acc of accounts) {
        if (!results[acc.platform_user_id]) {
            results[acc.platform_user_id] = {
                platform_user_id: acc.platform_user_id,
                is_live: false,
                raw: null
            };
        }
    }

    return { byPlatformUserId: results, errors };
}
