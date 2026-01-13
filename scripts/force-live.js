/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js');

async function forceLive() {
    const URL = "https://cajuzvubchjvmrkbkxav.supabase.co";
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanV6dnViY2hqdm1ya2JreGF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NTUyNCwiZXhwIjoyMDgzMjQxNTI0fQ.0elFRCjfyrR_DOHMHWlXKbr909nymm47o33uTb5jla4";

    const db = createClient(URL, KEY, { auth: { persistSession: false } });

    // 1. Get Account ID
    const { data: streamers } = await db.from("streamers").select("id, platform_accounts(id)").eq("slug", "cult-of-psyche").single();
    if (!streamers) {
        console.log("Cult of Psyche not found");
        return;
    }
    const accountId = streamers.platform_accounts[0].id;
    console.log("Account ID:", accountId);

    // 2. Insert Live Session
    const { error } = await db.from("live_sessions").insert({
        platform_account_id: accountId,
        is_live: true,
        title: "Test Live Stream - Cult of Psyche",
        stream_url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", // Lofi Girl as test
        started_at: new Date().toISOString(),
        thumbnail_url: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault_live.jpg"
    });

    if (error) console.error("Error going live:", error);
    else console.log("Cult of Psyche is now LIVE!");
}

forceLive();
