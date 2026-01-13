import Link from "next/link";
import { ArrowLeft, Trophy, Medal, Award, Coins } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";

async function getLeaderboard() {
    const db = supabasePublic();
    
    // Note: This is a simplified version. In production, you'd want to join with auth.users
    // but that requires admin access. For now, we'll show balances without user emails.
    const { data, error } = await db
        .from("user_tokens")
        .select("balance, total_earned, user_id")
        .order("balance", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Leaderboard error:", error);
        return [];
    }

    return data || [];
}

export default async function LeaderboardPage() {
    const leaderboard = await getLeaderboard();

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="h-6 w-6 text-zinc-400" />;
        if (rank === 3) return <Medal className="h-6 w-6 text-amber-600" />;
        return <Award className="h-5 w-5 text-zinc-600" />;
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return "from-yellow-600/30 to-amber-600/30 border-yellow-500/50";
        if (rank === 2) return "from-zinc-400/30 to-zinc-500/30 border-zinc-400/50";
        if (rank === 3) return "from-amber-600/30 to-orange-600/30 border-amber-500/50";
        return "from-zinc-900/50 to-zinc-800/50 border-zinc-800";
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                            <Trophy className="h-8 w-8 text-yellow-400" />
                            Token Leaderboard
                        </h1>
                        <p className="text-zinc-400">Top token holders in the Cult of Psyche community</p>
                    </div>

                    {/* Leaderboard */}
                    {leaderboard.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                            <Coins className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-500">No token holders yet. Be the first to earn tokens!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leaderboard.map((entry, index) => {
                                const rank = index + 1;
                                return (
                                    <div
                                        key={entry.user_id}
                                        className={`bg-gradient-to-r ${getRankColor(rank)} border rounded-xl p-6 flex items-center justify-between hover:scale-[1.01] transition-transform`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                {getRankIcon(rank)}
                                                <span className="text-2xl font-bold text-zinc-300 w-8">
                                                    #{rank}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">
                                                    Seeker #{entry.user_id.substring(0, 8)}
                                                </div>
                                                <div className="text-sm text-zinc-400">
                                                    {entry.total_earned.toLocaleString()} total earned
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Coins className="h-5 w-5 text-yellow-400" />
                                            <span className="text-2xl font-bold text-yellow-300">
                                                {entry.balance.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Info */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center">
                        <p className="text-zinc-400 text-sm">
                            Earn tokens by watching streams, following streamers, creating clips, and participating in the community.
                        </p>
                        <Link
                            href="/me/tokens"
                            className="inline-block mt-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
                        >
                            View Your Token Balance →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
