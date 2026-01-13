/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js');

async function checkState() {
    const URL = "https://cajuzvubchjvmrkbkxav.supabase.co";
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanV6dnViY2hqdm1ya2JreGF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NTUyNCwiZXhwIjoyMDgzMjQxNTI0fQ.0elFRCjfyrR_DOHMHWlXKbr909nymm47o33uTb5jla4";

    const db = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

    console.log("Checking DB State for Cult of Psyche...");

    const { data: allStreamers, error } = await db.from("streamers").select("slug, id");
    if (error) console.error("List Error:", error);
    else console.log("Available Streamers:", allStreamers);

    const { data: streamers, error: fetchError } = await db
        .from("streamers")
        .select(`
            id,
            slug,
            platform_accounts (
                platform,
                platform_user_id,
                live_sessions (
                    is_live,
                    title,
                    stream_url,
                    started_at
                )
            )
        `)
        .eq("slug", "cult-of-psyche")
        .single();

    if (fetchError) {
        console.error("Fetch Error:", fetchError);
    }

    if (!streamers) {
        console.log("Streamer not found.");
        return;
    }

    const account = streamers.platform_accounts[0];
    console.log("Account:", account.platform, account.platform_user_id);
    const sessions = account.live_sessions;
    console.log("Live Sessions:", sessions);
}

checkState();
