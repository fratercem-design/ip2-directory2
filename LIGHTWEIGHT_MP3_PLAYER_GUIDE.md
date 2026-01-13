# 🎵 Lightweight MP3 Player Guide

## Overview
A lightweight, minimal MP3 player component that plays music across the site. It's designed to be simple, performant, and easy to configure.

## Features

- **Minimal Design**: Clean, bottom-bar player that doesn't obstruct content
- **Play/Pause**: Basic playback controls
- **Next/Previous**: Navigate between tracks
- **Progress Bar**: Seek through tracks
- **Volume Control**: Adjust volume with mute option
- **Track Info**: Display current track title and artist
- **Responsive**: Works on mobile and desktop
- **Auto-play**: Optional auto-play support
- **Playlist Support**: Play multiple tracks in sequence

## Usage

### Basic Usage
```tsx
import { LightweightMP3Player } from "@/components/lightweight-mp3-player";

// In your layout or page
<LightweightMP3Player />
```

### With Custom Playlist
```tsx
const myTracks = [
    {
        title: "Song Title",
        artist: "Artist Name",
        url: "/music/song.mp3"
    },
    {
        title: "Another Song",
        artist: "Another Artist",
        url: "/music/another-song.mp3"
    }
];

<LightweightMP3Player 
    tracks={myTracks}
    autoPlay={false}
    showPlaylist={false}
/>
```

## Props

### `tracks` (optional)
Array of track objects. Default: Empty array (player won't show if no tracks).

```tsx
interface Track {
    title: string;      // Track title (required)
    artist?: string;    // Artist name (optional)
    url: string;        // MP3 file URL (required)
}
```

### `autoPlay` (optional)
Boolean. If true, automatically starts playing when track changes. Default: `false`.

**Note**: Browser autoplay policies may prevent this from working without user interaction.

### `showPlaylist` (optional)
Boolean. Currently reserved for future playlist display feature. Default: `false`.

## File Structure

### Adding MP3 Files
1. Create a `public/music/` directory in your project
2. Add your MP3 files to this directory
3. Reference them in your tracks array:

```tsx
{
    title: "My Song",
    url: "/music/my-song.mp3"
}
```

### Example Structure
```
public/
  music/
    track1.mp3
    track2.mp3
    ambient-sound.mp3
```

## Customization

### Changing Default Tracks
Edit the `defaultTracks` array in `lightweight-mp3-player.tsx`:

```tsx
const defaultTracks: Track[] = [
    {
        title: "Your Track",
        artist: "Your Artist",
        url: "/music/your-track.mp3"
    }
];
```

### Styling
The player uses Tailwind CSS classes. You can modify:
- Colors: Change `purple-600` to your preferred color
- Size: Adjust padding and spacing
- Position: Currently fixed at bottom, can be changed

### Volume Default
Default volume is set to 0.7 (70%). Change in component:
```tsx
const [volume, setVolume] = useState(0.7); // Change this value
```

## Player Controls

### Desktop
- **Previous/Next**: Arrow buttons
- **Play/Pause**: Center button
- **Progress**: Clickable progress bar
- **Volume**: Slider with mute button
- **Close**: X button to hide player

### Mobile
- **Controls**: Same as desktop
- **Progress**: Full-width bar below controls
- **Volume**: Hidden on very small screens

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile**: Works on iOS and Android
- **Autoplay**: May be blocked by browser policies (requires user interaction)

## Performance

- **Lightweight**: Minimal JavaScript, no external dependencies
- **Lazy Loading**: Audio loads on demand
- **Memory Efficient**: Cleans up event listeners properly
- **No External Libraries**: Uses native HTML5 audio

## Troubleshooting

### Audio Won't Play
1. Check file paths are correct
2. Ensure MP3 files exist in `public/music/`
3. Check browser console for errors
4. Verify file format (MP3)

### Autoplay Not Working
- Browsers block autoplay without user interaction
- User must click play button first
- This is a browser security feature

### Volume Issues
- Check volume slider value
- Ensure not muted
- Verify audio file isn't corrupted

## Future Enhancements

Potential additions:
- **Playlist Display**: Show full playlist
- **Shuffle**: Random track order
- **Repeat**: Loop single track or playlist
- **Keyboard Shortcuts**: Space for play/pause, etc.
- **Visualizer**: Audio waveform visualization
- **Equalizer**: Audio effects
- **Streaming**: Support for streaming URLs

## Best Practices

1. **File Size**: Keep MP3 files reasonably sized (< 10MB recommended)
2. **Format**: Use standard MP3 format (128-320 kbps)
3. **Naming**: Use descriptive filenames
4. **Organization**: Keep music files in `public/music/`
5. **Testing**: Test on multiple browsers and devices

## Integration

The player is already integrated into the site layout (`src/app/layout.tsx`). It will appear on all pages.

To remove it, simply remove or comment out:
```tsx
<LightweightMP3Player />
```

---

*"Music is the language of the soul. Let it play, let it guide, let it transform."*
