
import type { AccountDue, BatchFetchResult, LiveSnapshot } from "./types";

// TikTok Live API integration
// Note: TikTok doesn't have a public API for live streams like Twitch/YouTube
// This is a placeholder implementation that can be extended when TikTok API access is available

export async function fetchTikTokLive(accounts: AccountDue[]): Promise<BatchFetchResult> {
    // TikTok API implementation would go here
    // Currently returns empty results as TikTok doesn't provide public live stream API
    
    const results: Record<string, LiveSnapshot> = {};
    const errors: Array<{ platform_user_id: string; message: string }> = [];

    if (accounts.length === 0) return { byPlatformUserId: {} };

    for (const account of accounts) {
        // Placeholder: TikTok live detection would require TikTok API access
        // For now, mark as offline
        results[account.platform_user_id] = {
            platform_user_id: account.platform_user_id,
            is_live: false,
            raw: { platform: "tiktok", username: account.platform_username }
        };
    }

    return { byPlatformUserId: results, errors };
}
