/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');

async function fetchInsert() {
    const URL = "https://cajuzvubchjvmrkbkxav.supabase.co";
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanV6dnViY2hqdm1ya2JreGF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NTUyNCwiZXhwIjoyMDgzMjQxNTI0fQ.0elFRCjfyrR_DOHMHWlXKbr909nymm47o33uTb5jla4";

    const db = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

    const CORRECT_ID = "UCWw3dB8Fj_wsG4YFMMznqyw";

    console.log("1. Get Account ID...");
    const { data: accounts, error: findError } = await db
        .from("platform_accounts")
        .select("id")
        .eq("platform_user_id", CORRECT_ID)
        .single();

    if (!accounts) {
        console.error("Account not found (did fix work?):", findError);
        return;
    }
    const accountId = accounts.id;
    console.log("Account ID:", accountId);

    console.log("2. Fetch Live Status...");
    const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY || "AIzaSyBW0cEInAKRi8Ge5o5oO9QxCj7x3lN_v7I"
    });

    try {
        const searchRes = await youtube.search.list({
            channelId: CORRECT_ID,
            eventType: 'live',
            type: 'video',
            part: 'id,snippet',
            maxResults: 1
        });

        const items = searchRes.data.items;
        if (!items || items.length === 0) {
            console.log("YouTube API: OFFLINE (No live video found in corrected account)");
            return;
        }

        const video = items[0];
        console.log("LIVE FOUND:", video.snippet.title);
        console.log("Video ID:", video.id.videoId);

        // 3. Upsert Live Session
        // Note: live_sessions might have a unique constraint on (platform_account_id, external_session_id)
        // OR (platform_account_id) where is_live=true?
        // Let's try simple insert first or see error.
        console.log("3. Upserting Session...");

        const payload = {
            platform_account_id: accountId,
            external_session_id: video.id.videoId,
            is_live: true,
            started_at: video.snippet.publishTime || new Date().toISOString(),
            title: video.snippet.title,
            thumbnail_url: video.snippet.thumbnails?.high?.url,
            stream_url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            viewer_count: 0
            // last_seen_at might be auto or we add it
        };

        const { error: upsertError } = await db
            .from("live_sessions")
            .upsert(payload, { onConflict: "external_session_id" }); // Guessing constraint

        if (upsertError) {
            console.error("Upsert Error:", JSON.stringify(upsertError, null, 2));
            // Fallback: try different constraint?
        } else {
            console.log("Session Inserted/Updated!");
        }

    } catch (e) {
        console.error("API Error:", e.message);
    }
}

fetchInsert();
