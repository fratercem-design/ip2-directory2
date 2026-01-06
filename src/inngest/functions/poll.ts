
import { inngest } from "../client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { AccountDue, LiveSnapshot } from "@/lib/platforms/types";
import { fetchTwitchLive } from "@/lib/platforms/twitch";
import { fetchYouTubeLive } from "@/lib/platforms/youtube";
import { fetchKickLive } from "@/lib/platforms/kick";

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
        const [twitchRes, ytRes, kickRes] = await Promise.all([
            fetchTwitchLive(byPlatform.twitch ?? []),
            fetchYouTubeLive(byPlatform.youtube ?? []),
            fetchKickLive(byPlatform.kick ?? []),
        ]);

        const snapshots: Record<string, LiveSnapshot> = {
            ...twitchRes.byPlatformUserId,
            ...ytRes.byPlatformUserId,
            ...kickRes.byPlatformUserId,
        };

        // 4) process each account (idempotent via “one active session” constraint)
        for (const a of accounts as AccountDue[]) {
            const snap = snapshots[a.platform_user_id] ?? {
                platform_user_id: a.platform_user_id,
                is_live: false,
                raw: {},
            };

            // open session?
            const { data: open } = await db
                .from("live_sessions")
                .select("id")
                .eq("platform_account_id", a.id)
                .eq("is_live", true)
                .maybeSingle();

            const wasLive = !!open?.id;
            const isLive = !!snap.is_live;

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
                    title: snap.title ?? null,
                    category: snap.category ?? null,
                    viewer_count: snap.viewer_count ?? null,
                    stream_url: snap.stream_url ?? null,
                    thumbnail_url: snap.thumbnail_url ?? null,
                    raw: snap.raw as any ?? {},
                });
            }

            if (wasLive && !isLive) {
                await db.from("status_events").insert({
                    platform_account_id: a.id,
                    event_type: "went_offline",
                    payload: snap.raw as any ?? {},
                });

                await db
                    .from("live_sessions")
                    .update({ is_live: false, ended_at: new Date().toISOString() })
                    .eq("id", open!.id);
            }

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
