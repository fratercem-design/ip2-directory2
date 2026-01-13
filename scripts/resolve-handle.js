/* eslint-disable @typescript-eslint/no-require-imports */

const { google } = require('googleapis');

async function resolveHandle() {
    console.log("Resolving handle @cultofpsyche...");
    const youtube = google.youtube({
        version: 'v3',
        auth: process.env.YOUTUBE_API_KEY || "AIzaSyBW0cEInAKRi8Ge5o5oO9QxCj7x3lN_v7I"
    });

    try {
        const res = await youtube.channels.list({
            forHandle: '@cultofpsyche',
            part: 'id,snippet,contentDetails'
        });

        const items = res.data.items;
        if (!items || items.length === 0) {
            console.log("Handle NOT FOUND.");
            return;
        }

        const c = items[0];
        console.log("CORRECT Channel ID:", c.id);
        console.log("Title:", c.snippet.title);
        console.log("Uploads Playlist:", c.contentDetails.relatedPlaylists.uploads);

    } catch (e) {
        console.error("Error:", e.message);
    }
}

resolveHandle();
