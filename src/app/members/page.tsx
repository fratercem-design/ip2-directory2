"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Users, Coins, Heart, Video, Eye, Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface Member {
    user_id: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    member_since: string;
    token_balance: number;
    total_tokens_earned: number;
    follows_count: number;
    clips_count: number;
    readings_count: number;
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"member_since" | "tokens" | "follows" | "name">("member_since");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const limit = 24;

    useEffect(() => {
        loadMembers();
    }, [search, sortBy, order, page]);

    const loadMembers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                search: search,
                sort: sortBy,
                order: order,
                limit: limit.toString(),
                offset: (page * limit).toString()
            });

            const res = await fetch(`/api/members?${params}`);
            if (res.ok) {
                const data = await res.json();
                setMembers(data.members || []);
                setTotal(data.total || 0);
            }
        } catch (e) {
            console.error("Failed to load members", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(0); // Reset to first page on search
    };

    const handleSort = (newSort: typeof sortBy) => {
        if (sortBy === newSort) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            setSortBy(newSort);
            setOrder("desc");
        }
        setPage(0);
    };

    const getInitials = (name: string | null, email: string) => {
        if (name) {
            return name.substring(0, 2).toUpperCase();
        }
        return email.substring(0, 2).toUpperCase();
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                        <Users className="h-10 w-10 text-purple-400" />
                        Member Directory
                    </h1>
                    <p className="text-zinc-400">
                        Discover members of the Cult of Psyche community
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search members by name or bio..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-sm text-zinc-400">Sort by:</span>
                        <button
                            onClick={() => handleSort("member_since")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                sortBy === "member_since"
                                    ? "bg-purple-600 text-white"
                                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                        >
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Newest
                        </button>
                        <button
                            onClick={() => handleSort("tokens")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                sortBy === "tokens"
                                    ? "bg-purple-600 text-white"
                                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                        >
                            <Coins className="h-4 w-4 inline mr-2" />
                            Tokens
                        </button>
                        <button
                            onClick={() => handleSort("follows")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                sortBy === "follows"
                                    ? "bg-purple-600 text-white"
                                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                        >
                            <Heart className="h-4 w-4 inline mr-2" />
                            Follows
                        </button>
                        <button
                            onClick={() => handleSort("name")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                sortBy === "name"
                                    ? "bg-purple-600 text-white"
                                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                        >
                            Name
                        </button>
                        {sortBy && (
                            <button
                                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                                className="px-3 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                            >
                                {order === "asc" ? (
                                    <TrendingUp className="h-4 w-4" />
                                ) : (
                                    <TrendingDown className="h-4 w-4" />
                                )}
                            </button>
                        )}
                    </div>

                    <div className="text-sm text-zinc-500">
                        Showing {members.length} of {total} members
                    </div>
                </div>

                {/* Members Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
                                <div className="w-16 h-16 rounded-full bg-zinc-800 mb-4"></div>
                                <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                                <div className="h-3 bg-zinc-800 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : members.length === 0 ? (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                        <Users className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg mb-2">No members found</p>
                        <p className="text-zinc-500 text-sm">
                            {search ? "Try a different search term" : "Be the first to join!"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {members.map((member) => (
                                <Link
                                    key={member.user_id}
                                    href={`/members/${member.user_id}`}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-600/50 transition-all hover:scale-105 group"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        {member.avatar_url ? (
                                            <img
                                                src={member.avatar_url}
                                                alt={member.display_name || "Member"}
                                                className="w-16 h-16 rounded-full bg-zinc-800 object-cover"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-bold">
                                                {getInitials(member.display_name, member.user_id)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                                                {member.display_name || "Anonymous Member"}
                                            </h3>
                                            <p className="text-xs text-zinc-500">
                                                Member since {new Date(member.member_since).getFullYear()}
                                            </p>
                                        </div>
                                    </div>

                                    {member.bio && (
                                        <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                                            {member.bio}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <Coins className="h-4 w-4 text-yellow-400" />
                                            <div>
                                                <div className="text-xs text-zinc-500">Tokens</div>
                                                <div className="text-sm font-bold text-yellow-400">
                                                    {member.token_balance.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Heart className="h-4 w-4 text-red-400" />
                                            <div>
                                                <div className="text-xs text-zinc-500">Follows</div>
                                                <div className="text-sm font-bold text-red-400">
                                                    {member.follows_count}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Video className="h-4 w-4 text-blue-400" />
                                            <div>
                                                <div className="text-xs text-zinc-500">Clips</div>
                                                <div className="text-sm font-bold text-blue-400">
                                                    {member.clips_count}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-purple-400" />
                                            <div>
                                                <div className="text-xs text-zinc-500">Readings</div>
                                                <div className="text-sm font-bold text-purple-400">
                                                    {member.readings_count}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-zinc-400">
                                    Page {page + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
