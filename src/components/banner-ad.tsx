"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BannerAdProps {
    position: "top" | "bottom" | "sidebar" | "inline" | "floating";
    pagePath?: string;
    className?: string;
}

interface Ad {
    id: string;
    title: string;
    image_url: string;
    link_url: string;
    alt_text: string | null;
    ad_size: string;
    position: string;
}

export function BannerAd({ position, pagePath, className = "" }: BannerAdProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [dismissed, setDismissed] = useState(false);
    const [impressionRecorded, setImpressionRecorded] = useState(false);
    const impressionIdRef = useRef<string | null>(null);

    useEffect(() => {
        loadAd();
    }, [position, pagePath]);

    const loadAd = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                position,
                page_path: pagePath || window.location.pathname
            });

            const res = await fetch(`/api/ads?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.ad) {
                    setAd(data.ad);
                }
            }
        } catch (e) {
            console.error("Failed to load ad", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ad && !impressionRecorded) {
            recordImpression();
        }
    }, [ad, impressionRecorded]);

    const recordImpression = async () => {
        if (!ad || impressionRecorded) return;

        try {
            const res = await fetch("/api/ads/impression", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ad_id: ad.id,
                    page_path: pagePath || window.location.pathname
                })
            });

            if (res.ok) {
                const data = await res.json();
                impressionIdRef.current = data.impression?.id || null;
                setImpressionRecorded(true);
            }
        } catch (e) {
            console.error("Failed to record impression", e);
        }
    };

    const handleClick = async (e: React.MouseEvent) => {
        if (!ad) return;

        // Record click
        try {
            await fetch("/api/ads/click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ad_id: ad.id,
                    impression_id: impressionIdRef.current,
                    page_path: pagePath || window.location.pathname
                })
            });
        } catch (e) {
            console.error("Failed to record click", e);
        }

        // Open link in new tab
        window.open(ad.link_url, "_blank", "noopener,noreferrer");
    };

    const handleDismiss = () => {
        setDismissed(true);
        // Store dismissal in localStorage for session
        if (ad) {
            localStorage.setItem(`ad_dismissed_${ad.id}`, "true");
        }
    };

    // Check if ad was dismissed in this session
    useEffect(() => {
        if (ad) {
            const dismissed = localStorage.getItem(`ad_dismissed_${ad.id}`);
            if (dismissed === "true") {
                setDismissed(true);
            }
        }
    }, [ad]);

    if (loading || !ad || dismissed) return null;

    // Size classes based on ad_size
    const sizeClasses: Record<string, string> = {
        banner: "w-full h-24",
        sidebar: "w-full aspect-[4/5]",
        square: "w-full aspect-square",
        skyscraper: "w-full aspect-[1/3]",
        leaderboard: "w-full h-20"
    };

    const containerClasses: Record<string, string> = {
        top: "sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800",
        bottom: "sticky bottom-0 z-40 bg-zinc-900 border-t border-zinc-800",
        sidebar: "w-full",
        inline: "w-full my-4",
        floating: "fixed bottom-6 right-6 z-50 max-w-xs"
    };

    return (
        <div className={`${containerClasses[position]} ${className} relative`}>
            {/* Dismiss button for floating ads */}
            {position === "floating" && (
                <button
                    onClick={handleDismiss}
                    className="absolute -top-2 -right-2 z-10 bg-zinc-800 hover:bg-zinc-700 rounded-full p-1 transition-colors"
                    aria-label="Dismiss ad"
                >
                    <X className="h-3 w-3 text-zinc-400" />
                </button>
            )}

            {/* Ad label */}
            <div className="absolute top-0 left-0 bg-zinc-800/80 text-zinc-500 text-xs px-2 py-0.5 z-10">
                Ad
            </div>

            {/* Ad content */}
            <a
                href={ad.link_url}
                onClick={handleClick}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative"
            >
                <img
                    src={ad.image_url}
                    alt={ad.alt_text || ad.title}
                    className={`${sizeClasses[ad.ad_size] || "w-full"} object-cover cursor-pointer hover:opacity-90 transition-opacity`}
                />
            </a>
        </div>
    );
}
