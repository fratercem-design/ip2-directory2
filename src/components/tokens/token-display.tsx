"use client";

import { useEffect, useState } from "react";
import { Coins, TrendingUp } from "lucide-react";
import Link from "next/link";

interface TokenBalance {
    balance: number;
    total_earned: number;
    total_spent: number;
}

export function TokenDisplay({ compact = false }: { compact?: boolean }) {
    const [balance, setBalance] = useState<TokenBalance | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const res = await fetch("/api/tokens/balance");
            if (res.ok) {
                const data = await res.json();
                setBalance(data);
            }
        } catch (e) {
            console.error("Failed to fetch token balance", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-zinc-500">
                <Coins className="h-4 w-4 animate-pulse" />
                {!compact && <span className="text-sm">Loading...</span>}
            </div>
        );
    }

    if (!balance) return null;

    if (compact) {
        return (
            <Link
                href="/me/tokens"
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-700/50 px-3 py-1.5 rounded-full hover:from-yellow-600/30 hover:to-amber-600/30 transition-colors"
            >
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-300 font-bold text-sm">{balance.balance.toLocaleString()}</span>
            </Link>
        );
    }

    return (
        <Link
            href="/me/tokens"
            className="flex items-center gap-3 bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-700/50 px-4 py-2 rounded-lg hover:from-yellow-600/30 hover:to-amber-600/30 transition-colors"
        >
            <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-yellow-400" />
                <div>
                    <div className="text-yellow-300 font-bold text-lg">{balance.balance.toLocaleString()}</div>
                    <div className="text-yellow-500/70 text-xs">Tokens</div>
                </div>
            </div>
            <div className="h-8 w-px bg-yellow-700/50"></div>
            <div className="flex items-center gap-1 text-yellow-500/70 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>{balance.total_earned.toLocaleString()} earned</span>
            </div>
        </Link>
    );
}
