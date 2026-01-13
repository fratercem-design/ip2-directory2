/* eslint-disable @typescript-eslint/no-require-imports */

const { google } = require('googleapis');

async function checkLive() {
    console.log("Checking YouTube API directly...");
    const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY || "AIzaSyBW0cEInAKRi8Ge5o5oO9QxCj7x3lN_v7I" // Hardcoded fallback for script
    });

    const channelId = "UCWw3dB8Fj_wsG4YFMMznqqyw"; // Cult of Psyche

    try {
        // 1. Search for live video
        const searchRes = await youtube.search.list({
            channelId: channelId,
            eventType: 'live',
            type: 'video',
            part: 'id,snippet',
            maxResults: 1
        });

        const items = searchRes.data.items;
        if (!items || items.length === 0) {
            console.log("YouTube API reports: OFFLINE (No live video found in search)");

            // Debug: Search for *any* video to verify channel visibility
            const anyRes = await youtube.search.list({
                channelId: channelId,
                type: 'video',
                part: 'id,snippet',
                maxResults: 1,
                order: 'date' // Latest
            });
            console.log("Latest video found:", anyRes.data.items?.[0]?.snippet?.title || "None");

        } else {
            const video = items[0];
            console.log("YouTube API reports: LIVE!");
            console.log("Title:", video.snippet.title);
            console.log("Video ID:", video.id.videoId);
            console.log("URL:", `https://www.youtube.com/watch?v=${video.id.videoId}`);
        }

    } catch (e) {
        console.error("API Error:", e.message);
        if (e.response) {
            console.error("Details:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

checkLive();
