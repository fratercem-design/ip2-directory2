"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
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

export default function NewTopicPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        category_id: "",
        title: "",
        content: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadCategories();
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();
        if (!session) {
            router.push("/login?next=/board/new");
        }
    };

    const loadCategories = async () => {
        try {
            const res = await fetch("/api/board/categories");
            if (res.ok) {
                const data = await res.json();
                setCategories(data.categories || []);
                if (data.categories && data.categories.length > 0) {
                    setFormData(prev => ({ ...prev, category_id: data.categories[0].id }));
                }
            }
        } catch (e) {
            console.error("Failed to load categories", e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/board/topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/board/topic/${data.topic.id}`);
            } else {
                alert(data.error || "Failed to create topic");
            }
        } catch (e) {
            alert("Failed to create topic");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/board" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Board
                </Link>

                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">Create New Topic</h1>

                    <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                required
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Title <span className="text-zinc-500">(3-200 characters)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter topic title..."
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                                required
                                minLength={3}
                                maxLength={200}
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                {formData.title.length} / 200 characters
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Content <span className="text-zinc-500">(minimum 10 characters)</span>
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write your topic content..."
                                rows={10}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                                required
                                minLength={10}
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                {formData.content.length} characters
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || !formData.category_id || formData.title.length < 3 || formData.content.length < 10}
                            className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Send className="h-5 w-5" />
                            {submitting ? "Creating..." : "Create Topic"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
