
import type { AccountDue, BatchFetchResult, LiveSnapshot } from "./types";

const TWITCH_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_SECRET = process.env.TWITCH_CLIENT_SECRET;

// Simple in-memory cache for warm serverless instances
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAppAccessToken(): Promise<string> {
    if (!TWITCH_ID || !TWITCH_SECRET) {
        throw new Error("Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET");
    }

    // Reuse valid token
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    console.log("Twitch Adapter: Fast-refreshing App Access Token...");

    const params = new URLSearchParams();
    params.append("client_id", TWITCH_ID);
    params.append("client_secret", TWITCH_SECRET);
    params.append("grant_type", "client_credentials");

    const res = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        body: params,
    });

    if (!res.ok) {
        throw new Error(`Twitch Auth Failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    cachedToken = data.access_token;
    // Set expiry (expires_in is seconds, buffer 60s for safety)
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return cachedToken as string;
}

export async function fetchTwitchLive(accounts: AccountDue[]): Promise<BatchFetchResult> {
    if (accounts.length === 0) return { byPlatformUserId: {} };

    try {
        const token = await getAppAccessToken();
        const headers = {
            "Client-ID": TWITCH_ID!,
            "Authorization": `Bearer ${token}`,
        };

        // Chunk into batches of 100 (Helix limit)
        const chunks = [];
        for (let i = 0; i < accounts.length; i += 100) {
            chunks.push(accounts.slice(i, i + 100));
        }

        const results: Record<string, LiveSnapshot> = {};
        const errors: BatchFetchResult['errors'] = [];

        await Promise.all(chunks.map(async (chunk) => {
            const userIds = chunk.map(a => a.platform_user_id);
            // Dedupe IDs just in case
            const uniqueIds = Array.from(new Set(userIds));

            if (uniqueIds.length === 0) return;

            const qs = uniqueIds.map(id => `user_id=${id}`).join("&");
            const url = `https://api.twitch.tv/helix/streams?${qs}`;

            const res = await fetch(url, { headers });

            if (!res.ok) {
                // If one batch fails, we log it but don't break the whole poll
                console.error(`Twitch Batch Error: ${res.status}`);
                chunk.forEach(a => errors.push({ platform_user_id: a.platform_user_id, message: `API Error ${res.status}` }));
                return;
            }

            const data = await res.json();
            // data.data is the array of live streams
            // Map active streams to results
            for (const stream of data.data) {
                // Construct thumbnail (replace templated dimensions)
                const thumb = stream.thumbnail_url
                    ? stream.thumbnail_url.replace("{width}", "1280").replace("{height}", "720")
                    : null;

                results[stream.user_id] = {
                    platform_user_id: stream.user_id,
                    is_live: true,
                    started_at: stream.started_at,
                    title: stream.title,
                    category: stream.game_name,
                    viewer_count: stream.viewer_count,
                    stream_url: `https://twitch.tv/${stream.user_login}`,
                    thumbnail_url: thumb,
                    raw: stream,
                };
            }
        }));

        // Fill in offline state for anyone not found in the live list
        for (const account of accounts) {
            if (!results[account.platform_user_id]) {
                // If NOT in error list, mark as offline
                const hasError = errors.find(e => e.platform_user_id === account.platform_user_id);
                if (!hasError) {
                    results[account.platform_user_id] = {
                        platform_user_id: account.platform_user_id,
                        is_live: false,
                        raw: null
                    };
                }
            }
        }

        return { byPlatformUserId: results, errors };

    } catch (e: any) {
        // Global failure (e.g. auth failed)
        console.error("Twitch Adapter Critical Failure:", e);
        return {
            byPlatformUserId: {},
            errors: accounts.map(a => ({ platform_user_id: a.platform_user_id, message: e.message }))
        };
    }
}
