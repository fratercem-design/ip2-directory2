
import type { AccountDue, BatchFetchResult, LiveSnapshot } from "./types";

// Kick Public API (Unofficial but stable)
// Endpoint: https://kick.com/api/v1/channels/{slug}
// Returns: { slug: "...", livestream: { ... } | null, ... }

const CONCURRENCY_LIMIT = 5;

// Helper to delay for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchKickChannel(slug: string): Promise<LiveSnapshot | null> {
    try {
        const res = await fetch(`https://kick.com/api/v1/channels/${slug}`, {
            next: { revalidate: 0 }, // No cache
            headers: {
                "User-Agent": "IP2Directory/1.0 (Compatible; +https://ip2.directory)"
            }
        });

        if (res.status === 404) {
            // Channel not found
            return null; // Will map to offline/error later
        }

        if (!res.ok) {
            throw new Error(`Kick API ${res.status}`);
        }

        const data = await res.json();
        const stream = data.livestream;

        if (!stream) {
            // Online but not streaming
            return {
                platform_user_id: String(data.id), // Kick numeric ID
                is_live: false,
                raw: data // Store full channel data for debug/metadata updates
            };
        }

        return {
            platform_user_id: String(data.id),
            is_live: true,
            started_at: stream.created_at,
            title: stream.session_title,
            category: stream.categories?.[0]?.name,
            viewer_count: stream.viewer_count,
            stream_url: `https://kick.com/${data.slug}`,
            thumbnail_url: stream.thumbnail?.url,
            raw: stream
        };

    } catch (e: any) {
        console.warn(`Kick Fetch Error (${slug}):`, e.message);
        throw e;
    }
}

export async function fetchKickLive(accounts: AccountDue[]): Promise<BatchFetchResult> {
    if (accounts.length === 0) return { byPlatformUserId: {} };

    const results: Record<string, LiveSnapshot> = {};
    const errors: BatchFetchResult['errors'] = [];

    // Simple parallelism with chunks
    const chunks = [];
    for (let i = 0; i < accounts.length; i += CONCURRENCY_LIMIT) {
        chunks.push(accounts.slice(i, i + CONCURRENCY_LIMIT));
    }

    for (const chunk of chunks) {
        const promises = chunk.map(async (account) => {
            // Prefer platform_username (slug) over generic ID if available
            // Fallback: extract slug from channel_url or use user_id if it happens to be the slug
            const slug = account.platform_username || account.platform_user_id;

            try {
                const snapshot = await fetchKickChannel(slug);

                if (snapshot) {
                    // Important: The DB stores platform_user_id. 
                    // Kick API returns numeric ID. 
                    // If our DB used slug as ID, we match on that.
                    // If DB used numeric, we match on numeric.
                    // For safety, we key the result by the REQUESTED id (from account.platform_user_id)
                    // so the Inngest poller can look it up easily.

                    results[account.platform_user_id] = {
                        ...snapshot,
                        platform_user_id: account.platform_user_id // Override with our DB key to ensure match
                    };
                } else {
                    // 404 or other non-fatal issue treated as offline/error
                    errors.push({ platform_user_id: account.platform_user_id, message: "Channel not found" });
                }

            } catch (e: any) {
                errors.push({ platform_user_id: account.platform_user_id, message: e.message });
            }
        });

        await Promise.all(promises);
        // Small breathing room between chunks
        await delay(100);
    }

    return { byPlatformUserId: results, errors };
}
