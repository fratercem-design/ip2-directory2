"use client";

import { useEffect, useState } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Coins, TrendingUp, TrendingDown, Clock, Award } from "lucide-react";
import { TokenDisplay } from "@/components/tokens/token-display";

interface TokenBalance {
    balance: number;
    total_earned: number;
    total_spent: number;
}

interface Transaction {
    id: string;
    amount: number;
    transaction_type: string;
    description: string | null;
    created_at: string;
    metadata: Record<string, unknown>;
}

export default function TokensPage() {
    const [balance, setBalance] = useState<TokenBalance | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();

        if (!session) {
            router.push("/login?next=/me/tokens");
            return;
        }

        try {
            // Fetch balance
            const balanceRes = await fetch("/api/tokens/balance");
            if (balanceRes.ok) {
                const balanceData = await balanceRes.json();
                setBalance(balanceData);
            }

            // Fetch transactions
            const historyRes = await fetch("/api/tokens/history?limit=50");
            if (historyRes.ok) {
                const historyData = await historyRes.json();
                setTransactions(historyData.transactions || []);
            }
        } catch (e) {
            console.error("Failed to load token data", e);
        } finally {
            setLoading(false);
        }
    };

    const getTransactionIcon = (type: string) => {
        if (type.startsWith("earn_")) {
            return <TrendingUp className="h-4 w-4 text-emerald-400" />;
        }
        return <TrendingDown className="h-4 w-4 text-red-400" />;
    };

    const getTransactionLabel = (type: string) => {
        const labels: Record<string, string> = {
            earn_watch_stream: "Watched Stream",
            earn_daily_login: "Daily Login",
            earn_follow_streamer: "Followed Streamer",
            earn_create_clip: "Created Clip",
            earn_share_content: "Shared Content",
            earn_ritual_attendance: "Ritual Attendance",
            earn_community_contribution: "Community Contribution",
            spend_reward: "Purchased Reward",
            spend_feature: "Used Feature",
            admin_adjustment: "Admin Adjustment",
            transfer: "Transfer"
        };
        return labels[type] || type.replace(/_/g, " ");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                <div className="text-zinc-500">Loading tokens...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/me" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Profile
                </Link>

                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                            <Coins className="h-8 w-8 text-yellow-400" />
                            Token Balance
                        </h1>
                        <p className="text-zinc-400">Earn tokens through engagement and participation</p>
                        <Link
                            href="/tokens/sell"
                            className="inline-block mt-4 bg-emerald-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Sell Tokens →
                        </Link>
                    </div>

                    {/* Balance Card */}
                    {balance && (
                        <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-yellow-700/50 rounded-xl p-8">
                            <div className="grid md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-4xl font-bold text-yellow-300 mb-2">
                                        {balance.balance.toLocaleString()}
                                    </div>
                                    <div className="text-yellow-500/70 text-sm">Current Balance</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-emerald-300 mb-2">
                                        {balance.total_earned.toLocaleString()}
                                    </div>
                                    <div className="text-emerald-500/70 text-sm">Total Earned</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-red-300 mb-2">
                                        {balance.total_spent.toLocaleString()}
                                    </div>
                                    <div className="text-red-500/70 text-sm">Total Spent</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* How to Earn */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Award className="h-6 w-6 text-yellow-400" />
                            How to Earn Tokens
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <div className="font-bold text-emerald-400 mb-1">Watch Streams</div>
                                <div className="text-zinc-400 text-sm">Earn tokens for watching live streams</div>
                                <div className="text-yellow-400 text-xs mt-2">+10 tokens per hour</div>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <div className="font-bold text-emerald-400 mb-1">Daily Login</div>
                                <div className="text-zinc-400 text-sm">Check in daily to earn bonus tokens</div>
                                <div className="text-yellow-400 text-xs mt-2">+5 tokens per day</div>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <div className="font-bold text-emerald-400 mb-1">Follow Streamers</div>
                                <div className="text-zinc-400 text-sm">Follow your favorite streamers</div>
                                <div className="text-yellow-400 text-xs mt-2">+25 tokens per follow</div>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <div className="font-bold text-emerald-400 mb-1">Create Clips</div>
                                <div className="text-zinc-400 text-sm">Save memorable moments from streams</div>
                                <div className="text-yellow-400 text-xs mt-2">+15 tokens per clip</div>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <div className="font-bold text-emerald-400 mb-1">Ritual Attendance</div>
                                <div className="text-zinc-400 text-sm">Attend special rituals and ceremonies</div>
                                <div className="text-yellow-400 text-xs mt-2">+50 tokens per ritual</div>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                                <div className="font-bold text-emerald-400 mb-1">Community Contribution</div>
                                <div className="text-zinc-400 text-sm">Contribute to the community</div>
                                <div className="text-yellow-400 text-xs mt-2">Variable rewards</div>
                            </div>
                        </div>
                    </section>

                    {/* Transaction History */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Clock className="h-6 w-6 text-zinc-400" />
                            Transaction History
                        </h2>
                        {transactions.length === 0 ? (
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 text-center text-zinc-500">
                                No transactions yet. Start engaging to earn tokens!
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {transactions.map((tx) => (
                                    <div
                                        key={tx.id}
                                        className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:border-zinc-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getTransactionIcon(tx.transaction_type)}
                                            <div>
                                                <div className="font-medium text-white">
                                                    {getTransactionLabel(tx.transaction_type)}
                                                </div>
                                                {tx.description && (
                                                    <div className="text-xs text-zinc-500">{tx.description}</div>
                                                )}
                                                <div className="text-xs text-zinc-600">
                                                    {new Date(tx.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`font-bold ${
                                                tx.amount > 0 ? "text-emerald-400" : "text-red-400"
                                            }`}
                                        >
                                            {tx.amount > 0 ? "+" : ""}
                                            {tx.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
