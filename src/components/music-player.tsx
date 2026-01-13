"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Music, X, Minimize2, Maximize2 } from "lucide-react";

interface Track {
    title: string;
    artist: string;
    url: string;
    duration?: number;
}

// Placeholder tracks - replace with your actual music
const defaultPlaylist: Track[] = [
    {
        title: "Example Track 1",
        artist: "Artist Name",
        url: "https://example.com/track1.mp3"
    },
    {
        title: "Example Track 2",
        artist: "Artist Name",
        url: "https://example.com/track2.mp3"
    }
    // Add more tracks here
];

export function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playlist, setPlaylist] = useState<Track[]>(defaultPlaylist);
    
    const audioRef = useRef<HTMLAudioElement>(null);

    // Show player after a delay (optional - remove if you want it always visible)
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Set volume when it changes
        audio.volume = isMuted ? 0 : volume;

        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const updateDuration = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", handleNext);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", handleNext);
        };
    }, [currentTrack, volume, isMuted]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        const nextTrack = (currentTrack + 1) % playlist.length;
        setCurrentTrack(nextTrack);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play();
        }
    };

    const handlePrevious = () => {
        const prevTrack = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1;
        setCurrentTrack(prevTrack);
        setIsPlaying(true);
        if (audioRef.current) {
            audioRef.current.load();
            audioRef.current.play();
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume || 0.5;
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = parseFloat(e.target.value);
        setProgress(newProgress);
        if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (!isVisible || playlist.length === 0) return null;

    const track = playlist[currentTrack];

    return (
        <>
            <audio
                ref={audioRef}
                src={track.url}
                onLoadedMetadata={() => {
                    if (audioRef.current) {
                        setDuration(audioRef.current.duration);
                        audioRef.current.volume = isMuted ? 0 : volume;
                    }
                }}
            />

            {isMinimized ? (
                // Minimized player (floating button)
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
                    >
                        <Music className="h-5 w-5" />
                        {isPlaying && (
                            <div className="flex gap-1">
                                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "0s" }}></div>
                                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                            </div>
                        )}
                        <span className="hidden sm:inline text-sm font-medium">Music</span>
                    </button>
                </div>
            ) : (
                // Full player
                <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                                <Music className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-bold text-white">Cult of Psyche Radio</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMinimized(true)}
                                    className="p-1 hover:bg-zinc-800 rounded transition-colors"
                                    aria-label="Minimize"
                                >
                                    <Minimize2 className="h-4 w-4 text-zinc-400" />
                                </button>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="p-1 hover:bg-zinc-800 rounded transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="h-4 w-4 text-zinc-400" />
                                </button>
                            </div>
                        </div>

                        {/* Track Info */}
                        <div className="p-4 space-y-3">
                            <div className="space-y-1">
                                <h3 className="font-bold text-white truncate">{track.title}</h3>
                                <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleProgressChange}
                                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                                />
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>{formatTime((progress / 100) * duration)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handlePrevious}
                                    className="p-2 hover:bg-zinc-800 rounded transition-colors"
                                    aria-label="Previous track"
                                >
                                    <SkipBack className="h-5 w-5 text-zinc-400" />
                                </button>

                                <button
                                    onClick={togglePlay}
                                    className="p-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full hover:scale-110 transition-transform"
                                    aria-label={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? (
                                        <Pause className="h-6 w-6" />
                                    ) : (
                                        <Play className="h-6 w-6 ml-0.5" />
                                    )}
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="p-2 hover:bg-zinc-800 rounded transition-colors"
                                    aria-label="Next track"
                                >
                                    <SkipForward className="h-5 w-5 text-zinc-400" />
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={toggleMute}
                                        className="p-2 hover:bg-zinc-800 rounded transition-colors"
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
                                        className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                                    />
                                </div>
                            </div>

                            {/* Playlist Info */}
                            <div className="text-xs text-zinc-500 text-center pt-2 border-t border-zinc-800">
                                Track {currentTrack + 1} of {playlist.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
