
import type { AccountDue, BatchFetchResult, LiveSnapshot } from "./types";

// Instagram Live API integration
// Note: Instagram doesn't have a public API for live streams like Twitch/YouTube
// This is a placeholder implementation that can be extended when Instagram API access is available

export async function fetchInstagramLive(accounts: AccountDue[]): Promise<BatchFetchResult> {
    // Instagram API implementation would go here
    // Currently returns empty results as Instagram doesn't provide public live stream API
    
    const results: Record<string, LiveSnapshot> = {};
    const errors: Array<{ platform_user_id: string; message: string }> = [];

    if (accounts.length === 0) return { byPlatformUserId: {} };

    for (const account of accounts) {
        // Placeholder: Instagram live detection would require Instagram API access
        // For now, mark as offline
        results[account.platform_user_id] = {
            platform_user_id: account.platform_user_id,
            is_live: false,
            raw: { platform: "instagram", username: account.platform_username }
        };
    }

    return { byPlatformUserId: results, errors };
}
