# YouTube Live Theater Setup

## Overview
The Cult of Psyche site features a 24/7 YouTube Live Theater that automatically plays your lives and episodes when you're not currently live streaming.

## Configuration

### Setting Your Playlist ID

1. Create a YouTube playlist containing:
   - Your past live streams
   - Your episodes
   - Any other content you want to play 24/7

2. Get your playlist ID from the playlist URL:
   - Example: `https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxx`
   - The playlist ID is the part after `list=`

3. Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID=PLxxxxxxxxxxxxx
   ```

4. Restart your development server or redeploy

## How It Works

- **When Live**: The theater automatically switches to your live stream with chat
- **When Offline**: The theater plays your playlist on loop 24/7
- **Automatic**: No manual intervention needed - it switches seamlessly

## Features

- ✅ Continuous looping playback
- ✅ Automatic switching between live and playlist
- ✅ Theater mode with full-screen support
- ✅ Mobile-friendly inline playback
- ✅ Minimal YouTube branding
- ✅ Player controls enabled

## Tips

- Organize your playlist in the order you want episodes to play
- Add new lives/episodes to the playlist to keep content fresh
- The playlist will loop automatically when it reaches the end
