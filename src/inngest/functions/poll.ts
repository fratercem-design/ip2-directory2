
import { inngest } from "../client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AccountDue, LiveSnapshot } from "@/lib/platforms/types";
import { fetchTwitchLive } from "@/lib/platforms/twitch";
import { fetchYouTubeLive } from "@/lib/platforms/youtube";
import { fetchKickLive } from "@/lib/platforms/kick";
import { fetchTikTokLive } from "@/lib/platforms/tiktok";
import { fetchTwitterLive } from "@/lib/platforms/twitter";
import { fetchInstagramLive } from "@/lib/platforms/instagram";

function jitterSeconds(base: number, spread: number) {
    const delta = Math.floor((Math.random() * 2 - 1) * spread);
    return Math.max(10, base + delta);
}
function isoNowPlus(seconds: number) {
    return new Date(Date.now() + seconds * 1000).toISOString();
}

export const pollPlatformAccounts = inngest.createFunction(
    { id: "poll-platform-accounts" },
    { cron: "*/1 * * * *" },
    async () => {
        const db = supabaseAdmin();

        // 1) fetch due accounts
        const { data: accounts, error } = await db
            .from("platform_accounts")
            .select("id, platform, platform_user_id, platform_username, channel_url, metadata")
            .eq("is_enabled", true)
            .lte("next_check_at", new Date().toISOString())
            .limit(1000);

        if (error) throw error;
        if (!accounts?.length) return { ok: true, processed: 0 };

        // 2) group by platform
        const byPlatform = (accounts as AccountDue[]).reduce<Record<string, AccountDue[]>>((acc, a) => {
            (acc[a.platform] ||= []).push(a);
            return acc;
        }, {});

        // 3) batched fetch
        const [twitchRes, ytRes, kickRes, tiktokRes, twitterRes, instagramRes] = await Promise.all([
            fetchTwitchLive(byPlatform.twitch ?? []),
            fetchYouTubeLive(byPlatform.youtube ?? []),
            fetchKickLive(byPlatform.kick ?? []),
            fetchTikTokLive(byPlatform.tiktok ?? []),
            fetchTwitterLive(byPlatform.twitter ?? []),
            fetchInstagramLive(byPlatform.instagram ?? []),
        ]);

        const snapshots: Record<string, LiveSnapshot> = {
            ...twitchRes.byPlatformUserId,
            ...ytRes.byPlatformUserId,
            ...kickRes.byPlatformUserId,
            ...tiktokRes.byPlatformUserId,
            ...twitterRes.byPlatformUserId,
            ...instagramRes.byPlatformUserId,
        };

        // 4) process each account (idempotent via “one active session” constraint)
        for (const a of accounts as AccountDue[]) {
            const snap = snapshots[a.platform_user_id] ?? {
                platform_user_id: a.platform_user_id,
                is_live: false,
                raw: {},
            };
            const isLive = !!snap.is_live;

            // CANONICAL CHECK: Open session means ended_at is null
            const { data: open } = await db
                .from("live_sessions")
                .select("id")
                .eq("platform_account_id", a.id)
                .is("ended_at", null)
                .maybeSingle();

            const wasLive = !!open?.id;
            let outcome = "no_change";

            try {
                // CASE A: NEW SESSION (Was Offline -> Now Live)
                if (!wasLive && isLive) {
                    await db.from("status_events").insert({
                        platform_account_id: a.id,
                        event_type: "went_live",
                        payload: snap.raw as any ?? {},
                    });

                    await db.from("live_sessions").insert({
                        platform_account_id: a.id,
                        is_live: true,
                        started_at: snap.started_at ?? new Date().toISOString(),
                        ended_at: null, // Explicitly null
                        title: snap.title ?? null,
                        category: snap.category ?? null,
                        viewer_count: snap.viewer_count ?? null,
                        stream_url: snap.stream_url ?? null,
                        thumbnail_url: snap.thumbnail_url ?? null,
                        raw: snap.raw as any ?? {},
                    });
                    outcome = "created_session";
                }

                // CASE B: END SESSION (Was Live -> Now Offline)
                if (wasLive && !isLive) {
                    await db.from("status_events").insert({
                        platform_account_id: a.id,
                        event_type: "went_offline",
                        payload: snap.raw as any ?? {},
                    });

                    // Canonical Close: ended_at = NOW, is_live = FALSE
                    await db
                        .from("live_sessions")
                        .update({ is_live: false, ended_at: new Date().toISOString() })
                        .eq("id", open!.id);

                    outcome = "closed_session";
                }

                // CASE C: UPDATE EXISTING (Was Live -> Still Live)
                if (wasLive && isLive) {
                    await db
                        .from("live_sessions")
                        .update({
                            viewer_count: snap.viewer_count ?? null,
                            title: snap.title ?? null,
                            updated_at: new Date().toISOString()
                        })
                        .eq("id", open!.id);

                    outcome = "updated_session";
                }

            } catch (err: any) {
                // Idempotency Handler: If race condition (unique violation), we lost the race.
                // This means another worker inserted the session. Treat as success.
                if (err?.code === "23505" || err?.message?.includes("one_open_session_per_platform_account")) {
                    console.warn(`[Poll] Race condition handled for ${a.platform}/${a.platform_username}`);
                    outcome = "race_lost_refetched";
                } else {
                    throw err; // Real error
                }
            }

            // Structured Log "Proof of Life"
            console.log(JSON.stringify({
                event: "poll_account_result",
                platform: a.platform,
                username: a.platform_username,
                outcome,
                is_live: isLive,
                latency_ms: 0 // placeholder
            }));

            // next check: fast if live, slow if offline (jittered)
            const nextSeconds = isLive ? jitterSeconds(30, 10) : jitterSeconds(90, 30);

            await db
                .from("platform_accounts")
                .update({
                    last_checked_at: new Date().toISOString(),
                    next_check_at: isoNowPlus(nextSeconds),
                })
                .eq("id", a.id);
        }

        return { ok: true, processed: accounts.length };
    }
);
