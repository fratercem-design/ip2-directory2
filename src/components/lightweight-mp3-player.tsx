"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Music2, X } from "lucide-react";

interface Track {
    title: string;
    artist?: string;
    url: string;
}

interface LightweightMP3PlayerProps {
    tracks?: Track[];
    autoPlay?: boolean;
    showPlaylist?: boolean;
}

// Default playlist - replace with your actual MP3 files
const defaultTracks: Track[] = [
    {
        title: "Track 1",
        artist: "Artist",
        url: "/music/track1.mp3"
    },
    {
        title: "Track 2",
        artist: "Artist",
        url: "/music/track2.mp3"
    }
];

export function LightweightMP3Player({ 
    tracks = defaultTracks, 
    autoPlay = false,
    showPlaylist = false 
}: LightweightMP3PlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentTrack = tracks[currentTrackIndex];

    // Update current time
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            handleNext();
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [currentTrackIndex]);

    // Set volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Auto-play if enabled
    useEffect(() => {
        if (autoPlay && audioRef.current && !isPlaying) {
            audioRef.current.play().catch(() => {
                // Auto-play blocked by browser
            });
        }
    }, [autoPlay, currentTrackIndex]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(console.error);
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(console.error);
        }
    };

    const handlePrevious = () => {
        const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
        setCurrentTrackIndex(prevIndex);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play().catch(console.error);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!isVisible || tracks.length === 0) return null;

    return (
        <>
            <audio
                ref={audioRef}
                src={currentTrack.url}
                preload="metadata"
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration);
                    }
                }}
            />

            <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-4">
                        {/* Track Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <Music2 className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="font-medium text-white truncate">
                                    {currentTrack.title}
                                </div>
                                {currentTrack.artist && (
                                    <div className="text-sm text-zinc-400 truncate">
                                        {currentTrack.artist}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrevious}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                aria-label="Previous"
                                disabled={tracks.length <= 1}
                            >
                                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                                </svg>
                            </button>

                            <button
                                onClick={togglePlay}
                                className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    <Pause className="h-5 w-5" />
                                ) : (
                                    <Play className="h-5 w-5 ml-0.5" />
                                )}
                            </button>

                            <button
                                onClick={handleNext}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                aria-label="Next"
                                disabled={tracks.length <= 1}
                            >
                                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                                </svg>
                            </button>
                        </div>

                        {/* Progress */}
                        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
                            <span className="text-xs text-zinc-500 w-10 text-right">
                                {formatTime(currentTime)}
                            </span>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <span className="text-xs text-zinc-500 w-10">
                                {formatTime(duration)}
                            </span>
                        </div>

                        {/* Volume */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                                aria-label={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? (
                                    <VolumeX className="h-5 w-5 text-zinc-400" />
                                ) : (
                                    <Volume2 className="h-5 w-5 text-zinc-400" />
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                        </div>

                        {/* Close */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5 text-zinc-400" />
                        </button>
                    </div>

                    {/* Mobile Progress Bar */}
                    <div className="md:hidden mt-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                            <span>{formatTime(currentTime)}</span>
                            <span className="flex-1"></span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
