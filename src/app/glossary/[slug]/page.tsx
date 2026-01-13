"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Book, Eye, Link as LinkIcon, Sparkles, BookOpen, Flame, Users, Eye as EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type EntryType = "term" | "deity" | "concept" | "ritual" | "symbol" | "lineage";

interface Entry {
    id: string;
    entry_type: EntryType;
    title: string;
    slug: string;
    short_description: string | null;
    full_description: string;
    etymology: string | null;
    category: string | null;
    tags: string[];
    icon: string | null;
    image_url: string | null;
    source_references: string[] | null;
    view_count: number;
    related_entries_data: any[];
    relationships: any[];
    same_category: any[];
}

const entryTypeLabels: Record<EntryType, string> = {
    term: "Term",
    deity: "Deity",
    concept: "Concept",
    ritual: "Ritual",
    symbol: "Symbol",
    lineage: "Lineage"
};

const entryTypeIcons: Record<EntryType, any> = {
    term: BookOpen,
    deity: Sparkles,
    concept: Book,
    ritual: Flame,
    symbol: EyeIcon,
    lineage: Users
};

export default function GlossaryEntryPage({ params }: { params: Promise<{ slug: string }> }) {
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const resolvedParams = await params;
            await loadEntry(resolvedParams.slug);
        };
        init();
    }, [params]);

    const loadEntry = async (slug: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/glossary/${slug}`);
            if (res.ok) {
                const data = await res.json();
                setEntry(data.entry);
            } else if (res.status === 404) {
                router.push("/glossary");
            }
        } catch (e) {
            console.error("Failed to load entry", e);
        } finally {
            setLoading(false);
        }
    };

    const getTypeIcon = (type: EntryType) => {
        const Icon = entryTypeIcons[type];
        return <Icon className="h-5 w-5" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-zinc-400">Loading entry...</p>
                </div>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-4xl mx-auto">
                    <Link href="/glossary" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Directory
                    </Link>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                        <Book className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Entry Not Found</h2>
                        <p className="text-zinc-400">This entry may have been removed or doesn't exist.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/glossary" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Directory
                </Link>

                <div className="space-y-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-700/50 rounded-xl p-8">
                        <div className="flex items-start gap-4 mb-4">
                            <span className="text-5xl">{entry.icon || "📖"}</span>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {getTypeIcon(entry.entry_type)}
                                    <span className="text-sm text-zinc-400 uppercase">
                                        {entryTypeLabels[entry.entry_type]}
                                    </span>
                                </div>
                                <h1 className="text-4xl font-bold mb-4">{entry.title}</h1>
                                {entry.short_description && (
                                    <p className="text-xl text-zinc-300 mb-4">{entry.short_description}</p>
                                )}
                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        {entry.view_count} views
                                    </div>
                                    {entry.category && (
                                        <>
                                            <span>•</span>
                                            <span>{entry.category}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Description */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-4">Definition</h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-lg">
                                {entry.full_description}
                            </p>
                        </div>
                    </div>

                    {/* Etymology */}
                    {entry.etymology && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                <LinkIcon className="h-5 w-5 text-zinc-400" />
                                Etymology
                            </h3>
                            <p className="text-zinc-300">{entry.etymology}</p>
                        </div>
                    )}

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-purple-600/20 text-purple-400 border border-purple-700/50 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Related Entries */}
                    {entry.related_entries_data && entry.related_entries_data.length > 0 && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4">Related Entries</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {entry.related_entries_data.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={`/glossary/${related.slug}`}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                                    >
                                        <span className="text-2xl">{related.icon || "📖"}</span>
                                        <div>
                                            <div className="font-bold">{related.title}</div>
                                            {related.short_description && (
                                                <div className="text-sm text-zinc-400 line-clamp-1">
                                                    {related.short_description}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Same Category */}
                    {entry.same_category && entry.same_category.length > 0 && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4">More in {entry.category}</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {entry.same_category.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={`/glossary/${related.slug}`}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
                                    >
                                        <span className="text-2xl">{related.icon || "📖"}</span>
                                        <div className="font-bold">{related.title}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sources */}
                    {entry.source_references && entry.source_references.length > 0 && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                            <h3 className="text-lg font-bold mb-4">References</h3>
                            <ul className="space-y-2">
                                {entry.source_references.map((ref, i) => (
                                    <li key={i} className="text-zinc-300 text-sm">
                                        {ref}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
