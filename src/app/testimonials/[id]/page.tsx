"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Quote, Star, Calendar, Eye, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface Testimonial {
    id: string;
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    testimonial: string;
    rating: number | null;
    is_featured: boolean;
    tags: string[];
    created_at: string;
}

export default function TestimonialDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const resolvedParams = await params;
            await loadTestimonial(resolvedParams.id);
        };
        init();
    }, [params]);

    const loadTestimonial = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/testimonials/${id}`);
            if (res.ok) {
                const data = await res.json();
                setTestimonial(data.testimonial);
            } else if (res.status === 404) {
                router.push("/testimonials");
            }
        } catch (e) {
            console.error("Failed to load testimonial", e);
            router.push("/testimonials");
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number | null) => {
        if (!rating) return null;
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                    />
                ))}
            </div>
        );
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
                    <p className="text-zinc-400">Loading testimonial...</p>
                </div>
            </div>
        );
    }

    if (!testimonial) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/testimonials" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Testimonials
                    </Link>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                        <Quote className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Testimonial Not Found</h2>
                        <p className="text-zinc-400">This testimonial may have been removed or doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/testimonials" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Testimonials
                </Link>

                <article className="space-y-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-700/50 rounded-xl p-8">
                        <div className="flex items-start gap-6">
                            <Quote className="h-12 w-12 text-purple-400 flex-shrink-0" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    {testimonial.is_featured && (
                                        <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-700/50 rounded-full text-xs font-bold">
                                            Featured
                                        </span>
                                    )}
                                    {renderStars(testimonial.rating)}
                                </div>
                                <blockquote className="text-2xl font-bold text-white mb-6 leading-relaxed">
                                    "{testimonial.testimonial}"
                                </blockquote>
                            </div>
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            {testimonial.avatar_url ? (
                                <img
                                    src={testimonial.avatar_url}
                                    alt={testimonial.display_name}
                                    className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-purple-500"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl font-bold border-2 border-purple-500">
                                    {testimonial.display_name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1">{testimonial.display_name}</h3>
                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(testimonial.created_at)}
                                    </div>
                                    <Link
                                        href={`/members/${testimonial.user_id}`}
                                        className="flex items-center gap-1 hover:text-purple-400 transition-colors"
                                    >
                                        <User className="h-4 w-4" />
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {testimonial.tags && testimonial.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {testimonial.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-700/50 rounded-full text-sm font-medium"
                                >
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Share Section */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Share This Testimonial</h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied to clipboard!");
                                }}
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                Copy Link
                            </button>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${testimonial.testimonial.substring(0, 100)}..." - ${testimonial.display_name}`)}&url=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                            >
                                Share on Twitter
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
