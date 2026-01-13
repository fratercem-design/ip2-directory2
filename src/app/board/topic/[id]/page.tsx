"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Pin, Lock, Eye, Reply, Heart, MessageSquare, Send, Edit, Trash2 } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";

interface Topic {
    id: string;
    category: {
        name: string;
        slug: string;
        icon: string;
        color: string;
    };
    author: {
        display_name: string;
        avatar_url: string | null;
    };
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    view_count: number;
    reply_count: number;
    created_at: string;
    reactions: Record<string, string[]>;
}

interface Post {
    id: string;
    author: {
        display_name: string;
        avatar_url: string | null;
    };
    content: string;
    is_edited: boolean;
    edited_at: string | null;
    created_at: string;
    reactions: Record<string, string[]>;
}

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
    const [topic, setTopic] = useState<Topic | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [isOwnTopic, setIsOwnTopic] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const resolvedParams = await params;
            await loadTopic(resolvedParams.id);
        };
        init();
    }, [params]);

    const loadTopic = async (topicId: string) => {
        setLoading(true);
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();

        try {
            const res = await fetch(`/api/board/topics/${topicId}`);
            if (res.ok) {
                const data = await res.json();
                setTopic(data.topic);
                setPosts(data.posts || []);

                if (session && session.user.id === data.topic.user_id) {
                    setIsOwnTopic(true);
                }
            } else if (res.status === 404) {
                router.push("/board");
            }
        } catch (e) {
            console.error("Failed to load topic", e);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || !replyContent.trim()) return;

        setSubmitting(true);
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();

        if (!session) {
            router.push("/login?next=/board/topic/" + topic.id);
            return;
        }

        try {
            const res = await fetch("/api/board/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic_id: topic.id,
                    content: replyContent
                })
            });

            const data = await res.json();

            if (res.ok) {
                setReplyContent("");
                const resolvedParams = await params;
                await loadTopic(resolvedParams.id);
            } else {
                alert(data.error || "Failed to post reply");
            }
        } catch (e) {
            alert("Failed to post reply");
        } finally {
            setSubmitting(false);
        }
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-zinc-400">Loading topic...</p>
                </div>
            </div>
        );
    }

    if (!topic) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/board" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Board
                    </Link>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                        <MessageSquare className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Topic Not Found</h2>
                        <p className="text-zinc-400">This topic may have been deleted or doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/board" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Board
                </Link>

                <div className="space-y-6">
                    {/* Topic Header */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {topic.is_pinned && (
                                        <Pin className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                    )}
                                    {topic.is_locked && (
                                        <Lock className="h-5 w-5 text-zinc-500" />
                                    )}
                                    <span
                                        className="px-3 py-1 rounded-full text-sm font-medium"
                                        style={{ backgroundColor: topic.category.color + "20", color: topic.category.color }}
                                    >
                                        {topic.category.icon} {topic.category.name}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{topic.content}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                <div className="flex items-center gap-2">
                                    {topic.author.avatar_url ? (
                                        <img
                                            src={topic.author.avatar_url}
                                            alt={topic.author.display_name}
                                            className="w-6 h-6 rounded-full bg-zinc-800"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold">
                                            {getInitials(topic.author.display_name)}
                                        </div>
                                    )}
                                    <span>{topic.author.display_name}</span>
                                </div>
                                <span>•</span>
                                <span>{formatDate(topic.created_at)}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {topic.view_count}
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Reply className="h-4 w-4" />
                                    {topic.reply_count}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Replies */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Reply className="h-5 w-5" />
                            Replies ({posts.length})
                        </h2>

                        {posts.map((post) => (
                            <div key={post.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    {post.author.avatar_url ? (
                                        <img
                                            src={post.author.avatar_url}
                                            alt={post.author.display_name}
                                            className="w-10 h-10 rounded-full bg-zinc-800"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-bold">
                                            {getInitials(post.author.display_name)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-bold">{post.author.display_name}</span>
                                            {post.is_edited && (
                                                <span className="text-xs text-zinc-500">(edited)</span>
                                            )}
                                        </div>
                                        <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                                        <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
                                            <span>{formatDate(post.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {posts.length === 0 && (
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                                <MessageSquare className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                                <p className="text-zinc-400">No replies yet. Be the first to reply!</p>
                            </div>
                        )}
                    </div>

                    {/* Reply Form */}
                    {!topic.is_locked && (
                        <form onSubmit={handleReply} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                Post a Reply
                            </h3>
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write your reply..."
                                rows={6}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                                required
                                minLength={10}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !replyContent.trim()}
                                className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Send className="h-4 w-4" />
                                {submitting ? "Posting..." : "Post Reply"}
                            </button>
                        </form>
                    )}

                    {topic.is_locked && (
                        <div className="bg-yellow-600/20 border border-yellow-700/50 rounded-xl p-6 text-center">
                            <Lock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                            <p className="text-yellow-400 font-bold">This topic is locked</p>
                            <p className="text-yellow-500/70 text-sm mt-1">No new replies can be posted.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
