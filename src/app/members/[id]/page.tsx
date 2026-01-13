"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Coins, Heart, Video, Eye, Calendar, Mail, Settings } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";

interface MemberProfile {
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
    email?: string;
}

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const [member, setMember] = useState<MemberProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const resolvedParams = await params;
            await loadMember(resolvedParams.id);
        };
        init();
    }, [params]);

    const loadMember = async (memberId: string) => {
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();

        try {
            // Fetch member profile
            const res = await fetch(`/api/members/${memberId}`);
            if (res.ok) {
                const data = await res.json();
                setMember(data.member);
                
                // Check if this is the current user's profile
                if (session && session.user.id === memberId) {
                    setIsOwnProfile(true);
                }
            } else if (res.status === 404) {
                router.push("/members");
            }
        } catch (e) {
            console.error("Failed to load member", e);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string | null, id: string) => {
        if (name) {
            return name.substring(0, 2).toUpperCase();
        }
        return id.substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-zinc-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!member) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/members" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Members
                    </Link>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                        <Users className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Member Not Found</h2>
                        <p className="text-zinc-400">This member profile is not available or has been removed.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/members" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Members
                </Link>

                <div className="space-y-8">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-700/50 rounded-xl p-8">
                        <div className="flex items-start gap-6">
                            {member.avatar_url ? (
                                <img
                                    src={member.avatar_url}
                                    alt={member.display_name || "Member"}
                                    className="w-24 h-24 rounded-full bg-zinc-800 object-cover border-2 border-purple-500"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-bold border-2 border-purple-500">
                                    {getInitials(member.display_name, member.user_id)}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h1 className="text-3xl font-bold">
                                        {member.display_name || "Anonymous Member"}
                                    </h1>
                                    {isOwnProfile && (
                                        <Link
                                            href="/me"
                                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Edit Profile
                                        </Link>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 text-zinc-400 text-sm mb-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Member since {new Date(member.member_since).toLocaleDateString()}
                                    </div>
                                </div>
                                {member.bio && (
                                    <p className="text-zinc-300 leading-relaxed">{member.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Coins className="h-6 w-6 text-yellow-400" />
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Tokens</div>
                                    <div className="text-2xl font-bold text-yellow-400">
                                        {member.token_balance.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-zinc-600 mt-2">
                                {member.total_tokens_earned.toLocaleString()} total earned
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Heart className="h-6 w-6 text-red-400" />
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Follows</div>
                                    <div className="text-2xl font-bold text-red-400">
                                        {member.follows_count}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-zinc-600 mt-2">
                                Streamers followed
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Video className="h-6 w-6 text-blue-400" />
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Clips</div>
                                    <div className="text-2xl font-bold text-blue-400">
                                        {member.clips_count}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-zinc-600 mt-2">
                                Moments saved
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Eye className="h-6 w-6 text-purple-400" />
                                <div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-widest">Readings</div>
                                    <div className="text-2xl font-bold text-purple-400">
                                        {member.readings_count}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs text-zinc-600 mt-2">
                                Divination sessions
                            </div>
                        </div>
                    </div>

                    {/* Activity Section */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4">Activity Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                                <span className="text-zinc-400">Total Tokens Earned</span>
                                <span className="font-bold text-yellow-400">
                                    {member.total_tokens_earned.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                                <span className="text-zinc-400">Current Balance</span>
                                <span className="font-bold text-yellow-400">
                                    {member.token_balance.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                                <span className="text-zinc-400">Streamers Followed</span>
                                <span className="font-bold text-red-400">
                                    {member.follows_count}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                                <span className="text-zinc-400">Clips Created</span>
                                <span className="font-bold text-blue-400">
                                    {member.clips_count}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-zinc-400">Divination Readings</span>
                                <span className="font-bold text-purple-400">
                                    {member.readings_count}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
