# 🎵 Music Player Guide

## Overview
The Cult of Psyche site includes a floating music player that allows visitors to listen to ambient music, soundscapes, or tracks while browsing. The player can be minimized to a floating button or expanded to show full controls.

## Features

### Player Controls
- **Play/Pause**: Toggle playback
- **Next/Previous**: Navigate through playlist
- **Volume Control**: Adjust volume with slider
- **Mute/Unmute**: Quick mute toggle
- **Progress Bar**: Seek through tracks
- **Minimize/Maximize**: Toggle between floating button and full player

### Design
- Dark theme matching site aesthetic
- Red/orange gradient accents
- Smooth animations
- Responsive design
- Floating position (bottom-right)

## How to Add Music

### Step 1: Edit the Playlist
Open `src/components/music-player.tsx` and find the `defaultPlaylist` array (around line 20).

### Step 2: Add Your Tracks
Replace the placeholder tracks with your actual music:

```typescript
const defaultPlaylist: Track[] = [
    {
        title: "Track Name",
        artist: "Artist Name",
        url: "https://your-audio-url.com/track.mp3"
    },
    {
        title: "Another Track",
        artist: "Artist Name",
        url: "https://your-audio-url.com/track2.mp3"
    }
];
```

### Audio File Requirements
- **Format**: MP3, OGG, or WAV
- **Hosting**: Files must be publicly accessible
- **CORS**: Server must allow cross-origin requests
- **Size**: Consider file size for loading performance

### Recommended Hosting Options
1. **Your own server/CDN**
2. **SoundCloud** (embed links)
3. **Bandcamp** (direct links)
4. **Cloud storage** (AWS S3, Google Cloud, etc.)
5. **Audio hosting services** (Mixcloud, etc.)

## Customization

### Change Player Position
Edit the `fixed bottom-6 right-6` classes in the component to change position:
- `bottom-6 left-6` - Bottom left
- `top-6 right-6` - Top right
- `top-6 left-6` - Top left

### Auto-Show Delay
Currently set to show after 3 seconds. To change:
```typescript
setTimeout(() => setIsVisible(true), 3000); // Change 3000 to your delay in ms
```

To show immediately, remove the `useEffect` that sets the delay.

### Default Volume
Change the initial volume (0.0 to 1.0):
```typescript
const [volume, setVolume] = useState(1); // 1 = 100%, 0.5 = 50%
```

### Auto-Play
To auto-play when page loads, add to `useEffect`:
```typescript
if (audioRef.current) {
    audioRef.current.play();
    setIsPlaying(true);
}
```

## Track Information

Each track needs:
- **title**: Display name of the track
- **artist**: Artist/creator name
- **url**: Direct URL to audio file
- **duration** (optional): Track length in seconds (auto-detected if not provided)

## Example Playlist

```typescript
const defaultPlaylist: Track[] = [
    {
        title: "The Fire Litany",
        artist: "Cult of Psyche",
        url: "/audio/fire-litany.mp3"
    },
    {
        title: "Lunar Mirror Invocation",
        artist: "Cult of Psyche",
        url: "/audio/lunar-mirror.mp3"
    },
    {
        title: "Serpent Path Meditation",
        artist: "Cult of Psyche",
        url: "/audio/serpent-path.mp3"
    }
];
```

## Advanced Features

### Dynamic Playlist Loading
You can load playlists from an API or config file:

```typescript
useEffect(() => {
    fetch('/api/playlist')
        .then(res => res.json())
        .then(data => setPlaylist(data));
}, []);
```

### Shuffle/Repeat
Add shuffle and repeat buttons:
```typescript
const [isShuffled, setIsShuffled] = useState(false);
const [isRepeating, setIsRepeating] = useState(false);
```

### Playlist Display
Show full playlist in expanded view:
```typescript
{isExpanded && (
    <div className="playlist-view">
        {playlist.map((track, index) => (
            <button onClick={() => setCurrentTrack(index)}>
                {track.title}
            </button>
        ))}
    </div>
)}
```

## Best Practices

1. **File Size**: Compress audio files for web (128kbps MP3 is usually sufficient)
2. **Loading**: Consider lazy loading tracks
3. **Permissions**: Ensure audio files are publicly accessible
4. **Mobile**: Test on mobile devices (autoplay restrictions)
5. **Performance**: Don't load too many tracks at once
6. **Accessibility**: All controls have aria-labels

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Note: Some browsers block autoplay with sound

## Troubleshooting

### Audio Won't Play
- Check file URL is accessible
- Verify CORS headers on server
- Check browser console for errors
- Ensure file format is supported

### Volume Issues
- Check browser volume settings
- Verify audio file isn't corrupted
- Test with different audio files

### Mobile Issues
- Autoplay may be blocked (user interaction required)
- Some mobile browsers have audio restrictions
- Test on actual devices, not just emulators

## Integration with Site

The player is integrated into the root layout, so it appears on all pages. You can:
- Remove it from specific pages if needed
- Add it only to certain pages
- Create page-specific playlists

---

*The music player enhances the atmospheric experience of the Cult of Psyche site.*
