"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Book, Search, Filter, Star, Sparkles, Users, Flame, BookOpen, Eye } from "lucide-react";

type EntryType = "term" | "deity" | "concept" | "ritual" | "symbol" | "lineage";

interface Entry {
    id: string;
    entry_type: EntryType;
    title: string;
    slug: string;
    short_description: string | null;
    full_description: string;
    category: string | null;
    tags: string[];
    icon: string | null;
    is_featured: boolean;
    view_count: number;
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
    symbol: Eye,
    lineage: Users
};

const entryTypeColors: Record<EntryType, string> = {
    term: "text-blue-400",
    deity: "text-purple-400",
    concept: "text-indigo-400",
    ritual: "text-red-400",
    symbol: "text-yellow-400",
    lineage: "text-emerald-400"
};

export default function GlossaryPage() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [featured, setFeatured] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState<EntryType | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    useEffect(() => {
        loadEntries();
        loadFeatured();
    }, [selectedType, selectedCategory, search]);

    const loadEntries = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedType) {
                params.append("type", selectedType);
            }
            if (selectedCategory) {
                params.append("category", selectedCategory);
            }
            if (search) {
                params.append("search", search);
            }

            const res = await fetch(`/api/glossary?${params.toString()}&limit=100`);
            if (res.ok) {
                const data = await res.json();
                setEntries(data.entries || []);
            }
        } catch (e) {
            console.error("Failed to load entries", e);
        } finally {
            setLoading(false);
        }
    };

    const loadFeatured = async () => {
        try {
            const res = await fetch("/api/glossary?featured=true&limit=6");
            if (res.ok) {
                const data = await res.json();
                setFeatured(data.entries || []);
            }
        } catch (e) {
            console.error("Failed to load featured", e);
        }
    };

    const getTypeIcon = (type: EntryType) => {
        const Icon = entryTypeIcons[type];
        return <Icon className={`h-4 w-4 ${entryTypeColors[type]}`} />;
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                        <Book className="h-10 w-10 text-purple-400" />
                        Directory of Terms
                    </h1>
                    <p className="text-zinc-400">
                        Explore the concepts, deities, terms, and symbols of the Cult of Psyche
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search terms, deities, concepts..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                        />
                    </div>
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
                        All Types
                    </button>
                    {Object.entries(entryTypeLabels).map(([type, label]) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type as EntryType)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                                selectedType === type
                                    ? "bg-purple-600 text-white"
                                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                            }`}
                        >
                            {getTypeIcon(type as EntryType)}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Featured */}
                {featured.length > 0 && !search && !selectedType && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                            Featured Entries
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featured.map((entry) => (
                                <Link
                                    key={entry.id}
                                    href={`/glossary/${entry.slug}`}
                                    className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-700/50 rounded-xl p-6 hover:border-purple-500 transition-all hover:scale-105"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="text-3xl">{entry.icon || "📖"}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getTypeIcon(entry.entry_type)}
                                                <span className="text-xs text-zinc-400 uppercase">
                                                    {entryTypeLabels[entry.entry_type]}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-lg">{entry.title}</h3>
                                        </div>
                                    </div>
                                    {entry.short_description && (
                                        <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2">
                                            {entry.short_description}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Entries */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        {search ? `Search Results` : selectedType ? `${entryTypeLabels[selectedType]}s` : "All Entries"}
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
                    ) : entries.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                            <Book className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400 text-lg mb-2">No entries found</p>
                            <p className="text-zinc-500 text-sm">
                                {search ? "Try a different search term" : "Check back soon for more entries"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {entries.map((entry) => (
                                <Link
                                    key={entry.id}
                                    href={`/glossary/${entry.slug}`}
                                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-600/50 transition-all hover:scale-105"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="text-2xl">{entry.icon || "📖"}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {getTypeIcon(entry.entry_type)}
                                                <span className="text-xs text-zinc-400 uppercase">
                                                    {entryTypeLabels[entry.entry_type]}
                                                </span>
                                            </div>
                                            <h3 className="font-bold">{entry.title}</h3>
                                        </div>
                                    </div>
                                    {entry.short_description && (
                                        <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 mb-3">
                                            {entry.short_description}
                                        </p>
                                    )}
                                    {entry.tags && entry.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {entry.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500 pt-3 border-t border-zinc-800">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            {entry.view_count}
                                        </div>
                                        {entry.category && (
                                            <span>{entry.category}</span>
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
