"use client";

import { Heart } from "lucide-react";
import Link from "next/link";

interface SupportButtonProps {
    cashAppTag?: string;
    className?: string;
    variant?: "default" | "compact" | "inline";
}

export function SupportButton({ 
    cashAppTag = "$psycheawakens", 
    className = "",
    variant = "default"
}: SupportButtonProps) {
    const baseUrl = `https://cash.app/${cashAppTag.replace("$", "")}`;

    if (variant === "compact") {
        return (
            <a
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform ${className}`}
            >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Support</span>
            </a>
        );
    }

    if (variant === "inline") {
        return (
            <a
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-3 rounded bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 hover:from-emerald-600/30 hover:to-emerald-500/30 transition-colors border border-emerald-700/50 hover:border-emerald-600 ${className}`}
            >
                <Heart className="h-4 w-4 text-emerald-400" />
                <span className="text-white font-medium">Cash App</span>
                <span className="text-emerald-400 text-sm ml-auto font-mono">{cashAppTag}</span>
            </a>
        );
    }

    // Default variant
    return (
        <a
            href={baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform ${className}`}
        >
            <Heart className="h-5 w-5" />
            <span>Support via Cash App</span>
            <span className="text-emerald-100 text-sm font-mono ml-1">{cashAppTag}</span>
        </a>
    );
}
