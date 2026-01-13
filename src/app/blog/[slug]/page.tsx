"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Eye, BookOpen } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";

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
    is_ai_generated: boolean;
    view_count: number;
    published_at: string;
    created_at: string;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const resolvedParams = await params;
            await loadPost(resolvedParams.slug);
        };
        init();
    }, [params]);

    const loadPost = async (slug: string) => {
        setLoading(true);
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();

        try {
            const { data, error } = await db
                .from("blog_posts")
                .select("*")
                .eq("slug", slug)
                .eq("is_published", true)
                .single();

            if (error || !data) {
                router.push("/blog");
                return;
            }

            setPost(data);

            // Record view
            await db.from("blog_post_views").insert({
                post_id: data.id,
                user_id: session?.user.id || null
            });
        } catch (e) {
            console.error("Failed to load post", e);
            router.push("/blog");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-zinc-400">Loading post...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Blog
                    </Link>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                        <BookOpen className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
                        <p className="text-zinc-400">This post may have been removed or doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>

                <article className="space-y-8">
                    {/* Header */}
                    <header className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <span className="uppercase">{post.post_type}</span>
                            {post.is_ai_generated && (
                                <>
                                    <span>•</span>
                                    <span className="text-purple-400">AI Generated</span>
                                </>
                            )}
                            {post.category && (
                                <>
                                    <span>•</span>
                                    <span>{post.category}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-4xl font-bold">{post.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(post.published_at || post.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {post.view_count} views
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.featured_image_url && (
                        <div className="rounded-xl overflow-hidden">
                            <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-8 border-t border-zinc-800">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-700/50 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}
