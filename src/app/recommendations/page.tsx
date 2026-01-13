import Link from "next/link";
import { ArrowLeft, ExternalLink, Book, Sparkles, Heart, Moon, Flame, ShoppingBag } from "lucide-react";

interface Recommendation {
    title: string;
    description: string;
    url: string;
    category: "book" | "service" | "tool" | "resource" | "shop" | "other";
    icon?: React.ReactNode;
}

// Recommendations - including the official Cult of Psyche shop
const recommendations: Recommendation[] = [
    {
        title: "Psyche Awakens - Etsy Shop",
        description: "Official Cult of Psyche shop featuring spiritual items, ritual tools, divination supplies, and handcrafted items aligned with the path. Support the community and find tools for your journey.",
        url: "https://psycheawakens.etsy.com",
        category: "shop",
        icon: <ShoppingBag className="h-5 w-5" />
    },
    {
        title: "Example Book Recommendation",
        description: "A powerful exploration of shadow work and authentic becoming. This book has been instrumental in understanding the deeper aspects of the path.",
        url: "#",
        category: "book",
        icon: <Book className="h-5 w-5" />
    },
    {
        title: "Example Service Recommendation",
        description: "A trusted service that aligns with our values. This has been helpful for community members on their journey.",
        url: "#",
        category: "service",
        icon: <Sparkles className="h-5 w-5" />
    },
    {
        title: "Example Tool Recommendation",
        description: "A practical tool that supports the work. Useful for those walking the Serpent Path.",
        url: "#",
        category: "tool",
        icon: <Moon className="h-5 w-5" />
    },
    // Add more recommendations here
];

const categoryColors = {
    book: "from-purple-600/20 to-purple-500/20 border-purple-700/50 text-purple-300",
    service: "from-blue-600/20 to-blue-500/20 border-blue-700/50 text-blue-300",
    tool: "from-indigo-600/20 to-indigo-500/20 border-indigo-700/50 text-indigo-300",
    resource: "from-emerald-600/20 to-emerald-500/20 border-emerald-700/50 text-emerald-300",
    shop: "from-orange-600/20 to-red-500/20 border-orange-700/50 text-orange-300",
    other: "from-zinc-600/20 to-zinc-500/20 border-zinc-700/50 text-zinc-300"
};

const categoryIcons = {
    book: <Book className="h-5 w-5" />,
    service: <Sparkles className="h-5 w-5" />,
    tool: <Moon className="h-5 w-5" />,
    resource: <Flame className="h-5 w-5" />,
    shop: <ShoppingBag className="h-5 w-5" />,
    other: <Heart className="h-5 w-5" />
};

export default function RecommendationsPage() {
    const groupedByCategory = recommendations.reduce((acc, rec) => {
        if (!acc[rec.category]) {
            acc[rec.category] = [];
        }
        acc[rec.category].push(rec);
        return acc;
    }, {} as Record<string, Recommendation[]>);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-6xl mx-auto p-8">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight">Recommended Products & Services</h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Resources, tools, and services that align with the path of Cult of Psyche. 
                            These recommendations have been carefully selected to support your journey.
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            <strong className="text-zinc-300">Note:</strong> These recommendations are provided as resources 
                            that may support your path. Cult of Psyche may receive compensation for some recommendations, 
                            but we only recommend products and services we genuinely believe in and that align with our values.
                        </p>
                    </div>

                    {/* Recommendations by Category */}
                    {Object.entries(groupedByCategory).map(([category, items]) => (
                        <section key={category} className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                                <h2 className="text-2xl font-bold capitalize flex items-center gap-2">
                                    {categoryIcons[category as keyof typeof categoryIcons]}
                                    {category === "other" ? "Other Recommendations" : category === "shop" ? "Shops" : `${category}s`}
                                </h2>
                                <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {items.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group block bg-gradient-to-br ${categoryColors[item.category]} border rounded-xl p-6 hover:scale-[1.02] transition-all duration-200`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {item.icon || categoryIcons[item.category as keyof typeof categoryIcons]}
                                                <h3 className="text-xl font-bold group-hover:text-white transition-colors">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                                        </div>
                                        <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                            {item.description}
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* Empty State */}
                    {recommendations.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                            <div className="text-6xl mb-4">📚</div>
                            <h2 className="text-2xl font-bold text-zinc-300">Recommendations Coming Soon</h2>
                            <p className="text-zinc-500 max-w-md mx-auto">
                                We're curating a list of products and services that align with the path. 
                                Check back soon for recommendations.
                            </p>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border border-zinc-800 rounded-xl p-8 text-center space-y-4">
                        <h2 className="text-2xl font-bold">Have a Recommendation?</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            If you've found a product, service, or resource that has been valuable on your path 
                            and aligns with the values of Cult of Psyche, we'd love to hear about it.
                        </p>
                        <p className="text-zinc-500 text-sm">
                            Reach out through our social platforms or during a live stream.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap justify-center gap-4 pt-8 border-t border-zinc-800">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                        >
                            Watch Live
                        </Link>
                        <Link
                            href="/about"
                            className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/texts"
                            className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors"
                        >
                            Liturgical Texts
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
