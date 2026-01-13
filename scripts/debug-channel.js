/* eslint-disable @typescript-eslint/no-require-imports */

const { google } = require('googleapis');

async function debugChannel() {
    console.log("Debugging Channel...");
    const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY || "AIzaSyBW0cEInAKRi8Ge5o5oO9QxCj7x3lN_v7I"
    });

    try {
        const id = "UCWw3dB8Fj_wsG4YFMMznqqyw";
        const res = await youtube.channels.list({
            id: id,
            part: 'snippet,contentDetails,statistics,status'
        });

        const c = res.data.items?.[0];
        if (!c) {
            console.log("Channel NOT FOUND by ID:", id);
            return;
        }

        console.log("Channel Found:", c.snippet.title);
        console.log("Custom Url:", c.snippet.customUrl);
        console.log("Uploads Playlist:", c.contentDetails.relatedPlaylists.uploads);
        console.log("Video Count:", c.statistics.videoCount);
        console.log("Privacy:", c.status.privacyStatus);

    } catch (e) {
        console.error("Error:", e.message);
    }
}

debugChannel();
