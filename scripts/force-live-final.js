/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');

async function forceLiveFinal() {
    const URL = "https://cajuzvubchjvmrkbkxav.supabase.co";
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanV6dnViY2hqdm1ya2JreGF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NTUyNCwiZXhwIjoyMDgzMjQxNTI0fQ.0elFRCjfyrR_DOHMHWlXKbr909nymm47o33uTb5jla4";

    const db = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

    const CORRECT_ID = "UCWw3dB8Fj_wsG4YFMMznqyw";

    console.log("1. Get Account ID...");
    const { data: accounts } = await db.from("platform_accounts").select("id").eq("platform_user_id", CORRECT_ID).single();
    if (!accounts) {
        console.error("Account not found.");
        return;
    }
    const accountId = accounts.id;
    console.log("Account ID:", accountId);

    console.log("2. Fetch Live Status...");
    const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY || "AIzaSyBW0cEInAKRi8Ge5o5oO9QxCj7x3lN_v7I"
    });

    let video = null;
    try {
        const searchRes = await youtube.search.list({
            channelId: CORRECT_ID,
            eventType: 'live',
            type: 'video',
            part: 'id,snippet',
            maxResults: 1
        });

        // Validation
        if (searchRes.data.items && searchRes.data.items.length > 0) {
            video = searchRes.data.items[0];
            console.log("LIVE FOUND:", video.snippet.title);
        } else {
            console.log("YouTube API reports OFFLINE. (Is the stream Public?)");
            // Force test data if API fails but user says Live? 
            // No, better to trust API or user will just see error again.
            // But user SAID they are live.
            // If API says offline, maybe it's unlisted?
            // I'll proceed only if video found.
            return;
        }

    } catch (e) {
        console.error("API Error:", e.message);
        return;
    }

    // 3. Force Update
    console.log("3. Forcing DB Update...");

    // Cleanup old
    await db.from("live_sessions").delete().eq("platform_account_id", accountId);

    // Insert New
    const payload = {
        platform_account_id: accountId,
        // external_session_id removed (not in schema)
        is_live: true,
        started_at: video.snippet.publishTime || new Date().toISOString(),
        title: video.snippet.title,
        thumbnail_url: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url,
        stream_url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        viewer_count: 0,
        raw: { videoId: video.id.videoId, description: video.snippet.description }
        // last_seen_at removed (not in schema)
    };

    const { error } = await db.from("live_sessions").insert(payload);

    if (error) console.error("Insert Error:", error);
    else console.log("SUCCESS: Live Session Active!");
}

forceLiveFinal();
