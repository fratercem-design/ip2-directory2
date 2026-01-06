
export type Platform = "twitch" | "youtube" | "kick";

export type AccountDue = {
    id: string;
    platform: Platform;
    platform_user_id: string;
    platform_username: string | null;
    channel_url: string | null;
    metadata: Record<string, unknown>;
};

export type LiveSnapshot = {
    platform_user_id: string;
    is_live: boolean;
    started_at?: string;
    title?: string | null;
    category?: string | null;
    viewer_count?: number | null;
    stream_url?: string | null;
    thumbnail_url?: string | null;
    raw: unknown;
};

export type BatchFetchResult = {
    byPlatformUserId: Record<string, LiveSnapshot>;
    errors?: Array<{ platform_user_id: string; message: string }>;
};
