/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');

async function seed() {
    const URL = "https://cajuzvubchjvmrkbkxav.supabase.co";
    const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhanV6dnViY2hqdm1ya2JreGF2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NTUyNCwiZXhwIjoyMDgzMjQxNTI0fQ.0elFRCjfyrR_DOHMHWlXKbr909nymm47o33uTb5jla4";

    const db = createClient(URL, KEY, {
        auth: { persistSession: false, autoRefreshToken: false }
    });

    console.log("Creating Streamer...");
    // Upsert Streamer
    const { data: sData, error: sError } = await db
        .from("streamers")
        .upsert({
            slug: "cult-of-psyche",
            display_name: "Cult of Psyche",
            bio: "Official Channel of Cult of Psyche"
        }, { onConflict: "slug" })
        .select()
        .single();

    if (sError) {
        console.error("Streamer Error:", sError);
        return;
    }
    console.log("Streamer ID:", sData.id);

    // YouTube Account
    console.log("Checking YouTube Account...");
    const { data: existing } = await db.from("platform_accounts").select("id").eq("platform", "youtube").eq("platform_username", "cultofpsyche").maybeSingle();

    if (!existing) {
        const { error } = await db.from("platform_accounts").insert({
            streamer_id: sData.id,
            platform: "youtube",
            platform_user_id: "UCWw3dB8Fj_wsG4YFMMznqqyw",
            platform_username: "cultofpsyche",
            is_enabled: true
        });
        if (error) console.error("YouTube Account Error:", error);
        else console.log("YouTube Account Created.");
    } else {
        console.log("YouTube Account already exists.");
    }

    // Twitch Account
    console.log("Checking Twitch Account...");
    const { data: twitchExisting } = await db.from("platform_accounts").select("id").eq("platform", "twitch").eq("platform_username", "cultofpsyche").maybeSingle();

    if (!twitchExisting) {
        const { error: twitchError } = await db.from("platform_accounts").insert({
            streamer_id: sData.id,
            platform: "twitch",
            platform_user_id: "cultofpsyche", // Twitch username as ID until we get actual user ID
            platform_username: "cultofpsyche",
            channel_url: "https://www.twitch.tv/cultofpsyche",
            is_enabled: true
        });
        if (twitchError) console.error("Twitch Account Error:", twitchError);
        else console.log("Twitch Account Created.");
    } else {
        console.log("Twitch Account already exists.");
    }

    // Kick Account
    console.log("Checking Kick Account...");
    const { data: kickExisting } = await db.from("platform_accounts").select("id").eq("platform", "kick").eq("platform_username", "psycheawakenstarot").maybeSingle();

    if (!kickExisting) {
        const { error: kickError } = await db.from("platform_accounts").insert({
            streamer_id: sData.id,
            platform: "kick",
            platform_user_id: "psycheawakenstarot", // Kick username as ID until we get actual user ID
            platform_username: "psycheawakenstarot",
            channel_url: "https://kick.com/psycheawakenstarot",
            is_enabled: true
        });
        if (kickError) console.error("Kick Account Error:", kickError);
        else console.log("Kick Account Created.");
    } else {
        console.log("Kick Account already exists.");
    }

    // TikTok Account
    console.log("Checking TikTok Account...");
    const { data: tiktokExisting } = await db.from("platform_accounts").select("id").eq("platform", "tiktok").eq("platform_username", "cultofpsyche").maybeSingle();

    if (!tiktokExisting) {
        const { error: tiktokError } = await db.from("platform_accounts").insert({
            streamer_id: sData.id,
            platform: "tiktok",
            platform_user_id: "cultofpsyche", // TikTok username as ID until we get actual user ID
            platform_username: "cultofpsyche",
            channel_url: "https://www.tiktok.com/@cultofpsyche",
            is_enabled: true
        });
        if (tiktokError) console.error("TikTok Account Error:", tiktokError);
        else console.log("TikTok Account Created.");
    } else {
        console.log("TikTok Account already exists.");
    }

    // Twitter Account
    console.log("Checking Twitter Account...");
    const { data: twitterExisting } = await db.from("platform_accounts").select("id").eq("platform", "twitter").eq("platform_username", "psycheawakens").maybeSingle();

    if (!twitterExisting) {
        const { error: twitterError } = await db.from("platform_accounts").insert({
            streamer_id: sData.id,
            platform: "twitter",
            platform_user_id: "psycheawakens", // Twitter username as ID until we get actual user ID
            platform_username: "psycheawakens",
            channel_url: "https://twitter.com/psycheawakens",
            is_enabled: true
        });
        if (twitterError) console.error("Twitter Account Error:", twitterError);
        else console.log("Twitter Account Created.");
    } else {
        console.log("Twitter Account already exists.");
    }

    // Instagram Account
    console.log("Checking Instagram Account...");
    const { data: instagramExisting } = await db.from("platform_accounts").select("id").eq("platform", "instagram").eq("platform_username", "psycheawakens").maybeSingle();

    if (!instagramExisting) {
        const { error: instagramError } = await db.from("platform_accounts").insert({
            streamer_id: sData.id,
            platform: "instagram",
            platform_user_id: "psycheawakens", // Instagram username as ID until we get actual user ID
            platform_username: "psycheawakens",
            channel_url: "https://www.instagram.com/psycheawakens",
            is_enabled: true
        });
        if (instagramError) console.error("Instagram Account Error:", instagramError);
        else console.log("Instagram Account Created.");
    } else {
        console.log("Instagram Account already exists.");
    }
}

seed();
