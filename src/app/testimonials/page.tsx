"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Quote, Star, Users, Filter, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
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

const tagOptions = [
    { value: "community", label: "Community" },
    { value: "divination", label: "Divination" },
    { value: "streams", label: "Streams" },
    { value: "philosophy", label: "Philosophy" },
    { value: "growth", label: "Growth" },
    { value: "support", label: "Support" },
    { value: "rituals", label: "Rituals" }
];

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [featured, setFeatured] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        testimonial: "",
        rating: 0,
        display_name: "",
        tags: [] as string[]
    });
    const [myTestimonial, setMyTestimonial] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        loadTestimonials();
        loadMyTestimonial();
    }, [selectedTag]);

    const loadTestimonials = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedTag) {
                params.append("tag", selectedTag);
            }

            // Load featured
            const featuredRes = await fetch(`/api/testimonials?featured=true&limit=3`);
            if (featuredRes.ok) {
                const featuredData = await featuredRes.json();
                setFeatured(featuredData.testimonials || []);
            }

            // Load all
            const res = await fetch(`/api/testimonials?${params.toString()}&limit=50`);
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data.testimonials || []);
            }
        } catch (e) {
            console.error("Failed to load testimonials", e);
        } finally {
            setLoading(false);
        }
    };

    const loadMyTestimonial = async () => {
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();
        if (!session) return;

        try {
            const res = await fetch("/api/testimonials/my");
            if (res.ok) {
                const data = await res.json();
                if (data.testimonials && data.testimonials.length > 0) {
                    setMyTestimonial(data.testimonials[0]);
                    if (data.testimonials[0].status === "pending") {
                        setShowForm(true);
                        setFormData({
                            testimonial: data.testimonials[0].testimonial,
                            rating: data.testimonials[0].rating || 0,
                            display_name: data.testimonials[0].display_name || "",
                            tags: data.testimonials[0].tags || []
                        });
                    }
                }
            }
        } catch (e) {
            console.error("Failed to load my testimonial", e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();
        if (!session) {
            router.push("/login?next=/testimonials");
            return;
        }

        try {
            const res = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    testimonial: formData.testimonial,
                    rating: formData.rating || undefined,
                    display_name: formData.display_name || undefined,
                    tags: formData.tags.length > 0 ? formData.tags : undefined
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Testimonial submitted successfully!");
                setShowForm(false);
                setFormData({ testimonial: "", rating: 0, display_name: "", tags: [] });
                loadTestimonials();
                loadMyTestimonial();
            } else {
                alert(data.error || "Failed to submit testimonial");
            }
        } catch (e) {
            alert("Failed to submit testimonial");
        } finally {
            setSubmitting(false);
        }
    };

    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    const renderStars = (rating: number | null) => {
        if (!rating) return null;
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                        <Quote className="h-10 w-10 text-purple-400" />
                        Member Testimonials
                    </h1>
                    <p className="text-zinc-400">
                        Stories and experiences from members of the Cult of Psyche
                    </p>
                </div>

                {/* Submit Testimonial Button */}
                <div className="mb-8">
                    {myTestimonial ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {myTestimonial.status === "approved" ? (
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : myTestimonial.status === "pending" ? (
                                    <Clock className="h-5 w-5 text-yellow-400" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-400" />
                                )}
                                <div>
                                    <p className="font-bold">
                                        {myTestimonial.status === "approved" 
                                            ? "Your testimonial is live!" 
                                            : myTestimonial.status === "pending"
                                            ? "Your testimonial is pending review"
                                            : "Your testimonial was rejected"}
                                    </p>
                                    <p className="text-sm text-zinc-400">
                                        {myTestimonial.status === "pending" 
                                            ? "We'll review it soon"
                                            : myTestimonial.status === "rejected"
                                            ? myTestimonial.admin_notes || "Please review our guidelines"
                                            : "Thank you for sharing your experience"}
                                    </p>
                                </div>
                            </div>
                            {myTestimonial.status === "pending" && (
                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {showForm ? "Cancel Edit" : "Edit"}
                                </button>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                const db = supabasePublic();
                                db.auth.getSession().then(({ data: { session } }) => {
                                    if (!session) {
                                        router.push("/login?next=/testimonials");
                                    } else {
                                        setShowForm(!showForm);
                                    }
                                });
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Share Your Experience
                        </button>
                    )}
                </div>

                {/* Submit Form */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                        <h2 className="text-2xl font-bold">Write Your Testimonial</h2>
                        
                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Your Experience <span className="text-zinc-500">(10-1000 characters)</span>
                            </label>
                            <textarea
                                value={formData.testimonial}
                                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                                placeholder="Share your experience with the Cult of Psyche..."
                                rows={6}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                                required
                                minLength={10}
                                maxLength={1000}
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                {formData.testimonial.length} / 1000 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Rating (Optional)
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: formData.rating === rating ? 0 : rating })}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`h-8 w-8 ${
                                                formData.rating >= rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-zinc-600 hover:text-yellow-500"
                                            } transition-colors`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Display Name (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                placeholder="Leave blank to use your profile name"
                                maxLength={100}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Tags (Optional)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {tagOptions.map((tag) => (
                                    <button
                                        key={tag.value}
                                        type="button"
                                        onClick={() => {
                                            const tags = formData.tags.includes(tag.value)
                                                ? formData.tags.filter(t => t !== tag.value)
                                                : [...formData.tags, tag.value];
                                            setFormData({ ...formData, tags });
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                            formData.tags.includes(tag.value)
                                                ? "bg-purple-600 text-white"
                                                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                        }`}
                                    >
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || formData.testimonial.length < 10}
                            className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit Testimonial"}
                        </button>

                        <p className="text-xs text-zinc-500 text-center">
                            Your testimonial will be reviewed before being published. We reserve the right to edit or reject submissions that don't align with our community guidelines.
                        </p>
                    </form>
                )}

                {/* Featured Testimonials */}
                {featured.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                            Featured
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {featured.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-700/50 rounded-xl p-6"
                                >
                                    <Quote className="h-8 w-8 text-purple-400 mb-4" />
                                    <p className="text-zinc-300 mb-4 italic leading-relaxed">
                                        "{testimonial.testimonial}"
                                    </p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-purple-700/50">
                                        {testimonial.avatar_url ? (
                                            <img
                                                src={testimonial.avatar_url}
                                                alt={testimonial.display_name}
                                                className="w-10 h-10 rounded-full bg-zinc-800"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-bold">
                                                {getInitials(testimonial.display_name)}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{testimonial.display_name}</p>
                                            {renderStars(testimonial.rating)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filter */}
                <div className="mb-6 flex items-center gap-4 flex-wrap">
                    <Filter className="h-5 w-5 text-zinc-500" />
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedTag === null
                                ? "bg-purple-600 text-white"
                                : "bg-zinc-900 text-zinc-400 hover:text-white"
                        }`}
                    >
                        All
                    </button>
                    {tagOptions.map((tag) => (
                        <button
                            key={tag.value}
                            onClick={() => setSelectedTag(tag.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedTag === tag.value
                                    ? "bg-purple-600 text-white"
                                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>

                {/* All Testimonials */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        {selectedTag ? `${tagOptions.find(t => t.value === selectedTag)?.label} Testimonials` : "All Testimonials"}
                    </h2>
                    {loading ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
                                    <div className="h-4 bg-zinc-800 rounded mb-4"></div>
                                    <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                                    <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                            <Quote className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400 text-lg mb-2">No testimonials found</p>
                            <p className="text-zinc-500 text-sm">
                                {selectedTag ? "Try a different filter" : "Be the first to share your experience!"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {testimonials.map((testimonial) => (
                                <Link
                                    key={testimonial.id}
                                    href={`/testimonials/${testimonial.id}`}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-600/50 transition-all hover:scale-[1.02] block"
                                >
                                    <Quote className="h-6 w-6 text-purple-400 mb-4" />
                                    <p className="text-zinc-300 mb-4 leading-relaxed line-clamp-4">
                                        "{testimonial.testimonial}"
                                    </p>
                                    {testimonial.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {testimonial.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded"
                                                >
                                                    {tagOptions.find(t => t.value === tag)?.label || tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                                        {testimonial.avatar_url ? (
                                            <img
                                                src={testimonial.avatar_url}
                                                alt={testimonial.display_name}
                                                className="w-10 h-10 rounded-full bg-zinc-800"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-bold">
                                                {getInitials(testimonial.display_name)}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{testimonial.display_name}</p>
                                            {renderStars(testimonial.rating)}
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
