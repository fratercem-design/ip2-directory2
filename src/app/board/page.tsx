"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Plus, Pin, Lock, Eye, Reply, Clock, TrendingUp } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";

interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
    icon: string;
    color: string;
}

interface Topic {
    id: string;
    category_id: string;
    category: {
        name: string;
        slug: string;
        icon: string;
        color: string;
    };
    user_id: string;
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
    last_reply_at: string | null;
    last_reply_by: string | null;
    created_at: string;
}

export default function BoardPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadCategories();
        loadTopics();
    }, [selectedCategory]);

    const loadCategories = async () => {
        try {
            const res = await fetch("/api/board/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories || []);
            }
        } catch (e) {
            console.error("Failed to load categories", e);
        }
    };

    const loadTopics = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory) {
                params.append("category_id", selectedCategory);
            }

            const res = await fetch(`/api/board/topics?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setTopics(data.topics || []);
            }
        } catch (e) {
            console.error("Failed to load topics", e);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return d.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                            <MessageSquare className="h-10 w-10 text-purple-400" />
                            Message Board
                        </h1>
                        <p className="text-zinc-400 mt-2">
                            Join the conversation and connect with the community
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const db = supabasePublic();
                            db.auth.getSession().then(({ data: { session } }) => {
                                if (!session) {
                                    router.push("/login?next=/board/new");
                                } else {
                                    router.push("/board/new");
                                }
                            });
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        New Topic
                    </button>
                </div>

                {/* Categories */}
                <div className="mb-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`p-4 rounded-xl border transition-all text-left ${
                            selectedCategory === null
                                ? "bg-purple-600/20 border-purple-500"
                                : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <MessageSquare className="h-6 w-6 text-purple-400" />
                            <h3 className="font-bold">All Topics</h3>
                        </div>
                        <p className="text-sm text-zinc-400">View all discussions</p>
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`p-4 rounded-xl border transition-all text-left ${
                                selectedCategory === category.id
                                    ? "bg-purple-600/20 border-purple-500"
                                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{category.icon}</span>
                                <h3 className="font-bold">{category.name}</h3>
                            </div>
                            <p className="text-sm text-zinc-400">{category.description}</p>
                        </button>
                    ))}
                </div>

                {/* Topics List */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-800 grid grid-cols-12 gap-4 text-sm font-bold text-zinc-400">
                        <div className="col-span-6">Topic</div>
                        <div className="col-span-2 text-center">Author</div>
                        <div className="col-span-1 text-center">Replies</div>
                        <div className="col-span-1 text-center">Views</div>
                        <div className="col-span-2 text-right">Last Reply</div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-zinc-500">
                            Loading topics...
                        </div>
                    ) : topics.length === 0 ? (
                        <div className="p-12 text-center">
                            <MessageSquare className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400 text-lg mb-2">No topics found</p>
                            <p className="text-zinc-500 text-sm">
                                {selectedCategory ? "Try a different category" : "Be the first to start a discussion!"}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {topics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/board/topic/${topic.id}`}
                                    className="block px-6 py-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors grid grid-cols-12 gap-4 items-center"
                                >
                                    <div className="col-span-6">
                                        <div className="flex items-center gap-2 mb-1">
                                            {topic.is_pinned && (
                                                <Pin className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                            )}
                                            {topic.is_locked && (
                                                <Lock className="h-4 w-4 text-zinc-500" />
                                            )}
                                            <h3 className={`font-bold ${topic.is_pinned ? "text-yellow-400" : "text-white"} hover:text-purple-400 transition-colors`}>
                                                {topic.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span style={{ color: topic.category.color }}>
                                                {topic.category.icon} {topic.category.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
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
                                        <span className="text-sm text-zinc-400 truncate">
                                            {topic.author.display_name}
                                        </span>
                                    </div>
                                    <div className="col-span-1 text-center text-zinc-400 text-sm">
                                        {topic.reply_count}
                                    </div>
                                    <div className="col-span-1 text-center text-zinc-400 text-sm flex items-center justify-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {topic.view_count}
                                    </div>
                                    <div className="col-span-2 text-right text-xs text-zinc-500">
                                        {topic.last_reply_at ? (
                                            <div>
                                                <div>{formatDate(topic.last_reply_at)}</div>
                                                {topic.last_reply_by && (
                                                    <div className="text-zinc-600">by {topic.last_reply_by}</div>
                                                )}
                                            </div>
                                        ) : (
                                            <div>{formatDate(topic.created_at)}</div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
