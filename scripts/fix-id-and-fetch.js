/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');

async function fixAndFetch() {
    const URL = "https://cajuzvubchjvmrkbkxav.supabase.co";
    // Service Role Key from .env.local
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanV6dnViY2hqdm1ya2JreGF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NTUyNCwiZXhwIjoyMDgzMjQxNTI0fQ.0elFRCjfyrR_DOHMHWlXKbr909nymm47o33uTb5jla4";

    const db = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

    // Correct ID from resolve-handle.js
    const CORRECT_ID = "UCWw3dB8Fj_wsG4YFMMznqyw";

    console.log("1. Fix DB ID...");
    const { data: updateData, error: updateError } = await db
        .from("platform_accounts")
        .update({ platform_user_id: CORRECT_ID })
        .eq("platform_username", "cultofpsyche") // Ensure we target the right row
        .eq("platform", "youtube")
        .select()
        .single();

    if (updateError) {
        console.error("Update Error:", updateError);
        return;
    }
    console.log("Updated Account ID:", updateData.platform_user_id);

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
            console.log("YouTube API Still reports OFFLINE for corrected ID.");
            return;
        }

        const video = items[0];
        console.log("LIVE FOUND:", video.snippet.title);

        // 3. Upsert Live Session
        console.log("3. Upserting Session...");
        const { error: upsertError } = await db
            .from("live_sessions")
            .upsert({
                platform_account_id: updateData.id,
                external_session_id: video.id.videoId,
                is_live: true,
                started_at: video.snippet.publishTime || new Date().toISOString(),
                title: video.snippet.title,
                thumbnail_url: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url,
                stream_url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
                viewer_count: 0, // Search doesn't give viewers, poller will update later
                last_seen_at: new Date().toISOString()
            }, { onConflict: "platform_account_id, external_session_id" }); // Constraint might vary, usually assumes composite key or unique session ID

        // Check schema for unique constraint on live_sessions
        // Usually `(platform_account_id, is_live)` partial index? 
        // Or just insert.
        if (upsertError) console.error("Upsert Error:", upsertError);
        else console.log("Session Inserted/Updated!");

    } catch (e) {
        console.error("API Error:", e.message);
    }
}

fixAndFetch();
