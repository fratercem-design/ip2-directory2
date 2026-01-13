/* eslint-disable @typescript-eslint/no-require-imports */

const { createClient } = require('@supabase/supabase-js');

async function forceOffline() {
    const URL = "https://cajuzvubchjvmrkbkxav.supabase.co";
    // Verified from .env.local
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanV6dnViY2hqdm1ya2JreGF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NTUyNCwiZXhwIjoyMDgzMjQxNTI0fQ.0elFRCjfyrR_DOHMHWlXKbr909nymm47o33uTb5jla4";

    const db = createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });

    console.log("Searching for account 'cultofpsyche'...");

    // 1. Find Account by Username
    const { data: accounts, error: findError } = await db
        .from("platform_accounts")
        .select("id, platform_user_id")
        .eq("platform_username", "cultofpsyche");

    if (findError) {
        console.error("Find Error:", findError);
        return;
    }

    if (!accounts || accounts.length === 0) {
        console.log("Account not found via username 'cultofpsyche'.");
        return;
    }

    const accountId = accounts[0].id;
    console.log("Found Account ID:", accountId);

    // 2. Delete Live Sessions
    const { error: delError, count } = await db.from("live_sessions")
        .delete({ count: 'exact' })
        .eq("platform_account_id", accountId)
        .eq("is_live", true);

    if (delError) console.error("Error going offline:", delError);
    else console.log(`Cult of Psyche is now OFFLINE! Deleted ${count} sessions.`);
}

forceOffline();
