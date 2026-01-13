"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Eye, Sparkles, Filter } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    post_type: string;
    category: string | null;
    tags: string[];
    featured_image_url: string | null;
    is_featured: boolean;
    is_ai_generated: boolean;
    view_count: number;
    published_at: string;
    created_at: string;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [featured, setFeatured] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    useEffect(() => {
        loadPosts();
        loadFeatured();
    }, [selectedType]);

    const loadPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedType) {
                params.append("type", selectedType);
            }

            const res = await fetch(`/api/blog/posts?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts || []);
            }
        } catch (e) {
            console.error("Failed to load posts", e);
        } finally {
            setLoading(false);
        }
    };

    const loadFeatured = async () => {
        try {
            const res = await fetch("/api/blog/posts?featured=true&limit=3");
            if (res.ok) {
                const data = await res.json();
                setFeatured(data.posts || []);
            }
        } catch (e) {
            console.error("Failed to load featured", e);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                        <BookOpen className="h-10 w-10 text-purple-400" />
                        Blog
                    </h1>
                    <p className="text-zinc-400">
                        Daily articles, horoscopes, and insights from the Cult of Psyche
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex items-center gap-4 flex-wrap">
                    <Filter className="h-5 w-5 text-zinc-500" />
                    <button
                        onClick={() => setSelectedType(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedType === null
                                ? "bg-purple-600 text-white"
                                : "bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                    >
                        All Posts
                    </button>
                    <button
                        onClick={() => setSelectedType("article")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedType === "article"
                                ? "bg-purple-600 text-white"
                                : "bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                    >
                        Articles
                    </button>
                    <button
                        onClick={() => setSelectedType("horoscope")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedType === "horoscope"
                                ? "bg-purple-600 text-white"
                                : "bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                    >
                        Horoscopes
                    </button>
                </div>

                {/* Featured Posts */}
                {featured.length > 0 && !selectedType && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                            Featured
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featured.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-700/50 rounded-xl p-6 hover:border-purple-500 transition-all hover:scale-105"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-zinc-400 uppercase">
                                            {post.post_type}
                                        </span>
                                        {post.is_ai_generated && (
                                            <span className="text-xs text-purple-400">AI</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                                    {post.excerpt && (
                                        <p className="text-zinc-300 text-sm line-clamp-3 mb-4">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(post.published_at || post.created_at)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {post.view_count}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Posts */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        {selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s` : "All Posts"}
                    </h2>
                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
                                    <div className="h-4 bg-zinc-800 rounded mb-4"></div>
                                    <div className="h-3 bg-zinc-800 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                            <BookOpen className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400 text-lg mb-2">No posts found</p>
                            <p className="text-zinc-500 text-sm">
                                {selectedType ? "Try a different filter" : "Check back soon for new content"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-600/50 transition-all hover:scale-105"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-zinc-400 uppercase">
                                            {post.post_type}
                                        </span>
                                        {post.is_ai_generated && (
                                            <span className="text-xs text-purple-400">AI</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                                    {post.excerpt && (
                                        <p className="text-zinc-300 text-sm line-clamp-3 mb-4">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-zinc-500 pt-3 border-t border-zinc-800">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(post.published_at || post.created_at)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {post.view_count}
                                        </div>
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
