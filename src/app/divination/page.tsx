"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Moon, Flame, Eye, BookOpen, Save, Check } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";

type DivinationMethod = "tarot" | "oracle" | "lineage" | "serpent";

interface ReadingResult {
    method: DivinationMethod;
    cards: Array<{ name: string; meaning: string; position: string }>;
    interpretation: string;
    timestamp: string;
}

export default function DivinationPage() {
    const [selectedMethod, setSelectedMethod] = useState<DivinationMethod | null>(null);
    const [reading, setReading] = useState<ReadingResult | null>(null);
    const [isReading, setIsReading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const methods = [
        {
            id: "tarot" as DivinationMethod,
            name: "Tarot Reading",
            icon: <BookOpen className="h-8 w-8" />,
            description: "Three-card spread: Past, Present, Future",
            color: "from-purple-600/20 to-indigo-600/20 border-purple-700/50"
        },
        {
            id: "oracle" as DivinationMethod,
            name: "Oracle Guidance",
            icon: <Sparkles className="h-8 w-8" />,
            description: "Single card oracle reading",
            color: "from-blue-600/20 to-cyan-600/20 border-blue-700/50"
        },
        {
            id: "lineage" as DivinationMethod,
            name: "Lineage Resonance",
            icon: <Moon className="h-8 w-8" />,
            description: "Discover your resonance with the Twelve Lineages",
            color: "from-indigo-600/20 to-purple-600/20 border-indigo-700/50"
        },
        {
            id: "serpent" as DivinationMethod,
            name: "Serpent Path",
            icon: <Flame className="h-8 w-8" />,
            description: "Rahu and Ketu guidance",
            color: "from-red-600/20 to-orange-600/20 border-red-700/50"
        }
    ];

    const performReading = async (method: DivinationMethod) => {
        setIsReading(true);
        setSelectedMethod(method);

        // Simulate reading process
        await new Promise(resolve => setTimeout(resolve, 2000));

        let result: ReadingResult;

        switch (method) {
            case "tarot":
                result = generateTarotReading();
                break;
            case "oracle":
                result = generateOracleReading();
                break;
            case "lineage":
                result = generateLineageReading();
                break;
            case "serpent":
                result = generateSerpentReading();
                break;
            default:
                return;
        }

        setReading(result);
        setIsReading(false);
    };

    const generateTarotReading = (): ReadingResult => {
        const cards = [
            { name: "The Shadow", meaning: "What you've hidden from yourself", position: "Past" },
            { name: "The Flame", meaning: "Your current transformation", position: "Present" },
            { name: "The Becoming", meaning: "What you're becoming", position: "Future" }
        ];

        return {
            method: "tarot",
            cards,
            interpretation: "The Shadow shows what you've been avoiding. The Flame reveals your current state of transformation. The Becoming points to your path forward. Face the shadow, embrace the flame, walk the path.",
            timestamp: new Date().toISOString()
        };
    };

    const generateOracleReading = (): ReadingResult => {
        const oracles = [
            { name: "Psyche's Mirror", meaning: "Look within. The truth you seek is reflected in your own depths." },
            { name: "Rahu's Hunger", meaning: "Your desires are not shameful. They are direction. Follow them with awareness." },
            { name: "Ketu's Memory", meaning: "Remember what you've forgotten. Release what no longer serves." },
            { name: "The Serpent Path", meaning: "You are devoured but not destroyed. You are forgotten but not erased." },
            { name: "The First Flame", meaning: "The spark within you is the same fire that guides all seekers." }
        ];

        const card = oracles[Math.floor(Math.random() * oracles.length)];

        return {
            method: "oracle",
            cards: [{ ...card, position: "Guidance" }],
            interpretation: card.meaning,
            timestamp: new Date().toISOString()
        };
    };

    const generateLineageReading = (): ReadingResult => {
        const lineages = [
            { name: "Mask-Breaker", meaning: "Truth before comfort. You are called to break illusions." },
            { name: "Hunger-Tamer", meaning: "I choose what chooses me. Your desires guide you wisely." },
            { name: "Witness of Mirrors", meaning: "I see what is. You perceive truth beyond appearances." },
            { name: "Keeper of the Wound", meaning: "I feel and heal. Your wounds are teachers." },
            { name: "Lion Without Crown", meaning: "I shine without domination. Your power is gentle." },
            { name: "Imperfect Saint", meaning: "I refine, not erase. Perfection is not the goal." },
            { name: "Balancer of Hearts", meaning: "Honesty is harmony. Truth creates balance." },
            { name: "Serpent-Souled", meaning: "I descend to ascend. Your path goes through shadow." },
            { name: "Wanderer of Flames", meaning: "My aim carves my path. Your intention shapes reality." },
            { name: "Bearer of Burden", meaning: "I endure and complete. Your strength is in completion." },
            { name: "Storm-Mind", meaning: "Rebellion births evolution. Your resistance creates change." },
            { name: "Tidewalker", meaning: "I become everything. You are the universe becoming aware." }
        ];

        const lineage = lineages[Math.floor(Math.random() * lineages.length)];

        return {
            method: "lineage",
            cards: [{ ...lineage, position: "Your Resonance" }],
            interpretation: `You resonate with the ${lineage.name} lineage. ${lineage.meaning} This is not a role to play, but a truth to discover within yourself.`,
            timestamp: new Date().toISOString()
        };
    };

    const generateSerpentReading = (): ReadingResult => {
        const rahuGuidance = [
            "Your hunger is valid. What do you truly desire?",
            "Desire without shame. Want without apology.",
            "Your cravings point to your path. Follow them with awareness."
        ];

        const ketuGuidance = [
            "What have you forgotten that needs remembering?",
            "Release what no longer serves, but keep the lesson.",
            "Memory holds both wound and wisdom. Honor both."
        ];

        const rahu = rahuGuidance[Math.floor(Math.random() * rahuGuidance.length)];
        const ketu = ketuGuidance[Math.floor(Math.random() * ketuGuidance.length)];

        return {
            method: "serpent",
            cards: [
                { name: "Rahu - Serpent of Hunger", meaning: rahu, position: "Desire" },
                { name: "Ketu - Serpent of Memory", meaning: ketu, position: "Release" }
            ],
            interpretation: `Rahu shows your hunger: ${rahu} Ketu reveals what to release: ${ketu} Walk the path between them, guided by the First Flame of Psyche.`,
            timestamp: new Date().toISOString()
        };
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Eye className="h-10 w-10 text-purple-400" />
                            Divination System
                        </h1>
                        <p className="text-zinc-400 text-lg">
                            Seek guidance through the shadows and flames
                        </p>
                    </div>

                    {!reading ? (
                        <>
                            {/* Method Selection */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-center">Choose Your Method</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {methods.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => performReading(method.id)}
                                            disabled={isReading}
                                            className={`bg-gradient-to-br ${method.color} border rounded-xl p-6 text-left hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed space-y-3`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="text-purple-400">{method.icon}</div>
                                                <h3 className="text-xl font-bold">{method.name}</h3>
                                            </div>
                                            <p className="text-zinc-400 text-sm">{method.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reading in Progress */}
                            {isReading && selectedMethod && (
                                <div className="text-center space-y-4 py-12">
                                    <div className="flex justify-center gap-2">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                                    </div>
                                    <p className="text-zinc-400">Consulting the cards...</p>
                                    <p className="text-zinc-600 text-sm italic">The path reveals itself</p>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Reading Results */
                        <div className="space-y-8">
                            <div className="text-center">
                                <button
                                    onClick={() => {
                                        setReading(null);
                                        setSelectedMethod(null);
                                    }}
                                    className="text-zinc-500 hover:text-white text-sm mb-4"
                                >
                                    ← New Reading
                                </button>
                                <h2 className="text-3xl font-bold mb-2">Your Reading</h2>
                                <p className="text-zinc-400 text-sm">
                                    {new Date(reading.timestamp).toLocaleString()}
                                </p>
                            </div>

                            {/* Cards */}
                            <div className={`grid ${reading.cards.length === 1 ? "grid-cols-1" : reading.cards.length === 2 ? "grid-cols-2" : "grid-cols-3"} gap-4`}>
                                {reading.cards.map((card, index) => (
                                    <div
                                        key={index}
                                        className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700 rounded-xl p-6 space-y-3 text-center"
                                    >
                                        <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
                                            {card.position}
                                        </div>
                                        <h3 className="text-xl font-bold text-purple-300">{card.name}</h3>
                                        <p className="text-zinc-400 text-sm leading-relaxed">{card.meaning}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Interpretation */}
                            <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-700/50 rounded-xl p-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-400" />
                                    Interpretation
                                </h3>
                                <p className="text-zinc-300 leading-relaxed text-lg">{reading.interpretation}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setReading(null);
                                        setSelectedMethod(null);
                                        setSaved(false);
                                    }}
                                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                                >
                                    New Reading
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!reading || saved) return;
                                        
                                        setIsSaving(true);
                                        try {
                                            const db = supabasePublic();
                                            const { data: { session } } = await db.auth.getSession();
                                            
                                            if (!session) {
                                                alert("Please log in to save readings");
                                                setIsSaving(false);
                                                return;
                                            }

                                            const res = await fetch("/api/divination/save", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    method: reading.method,
                                                    cards: reading.cards,
                                                    interpretation: reading.interpretation
                                                })
                                            });

                                            if (res.ok) {
                                                setSaved(true);
                                                // Award tokens for divination
                                                try {
                                                    await fetch("/api/tokens/earn", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({
                                                            amount: 10,
                                                            transaction_type: "earn_community_contribution",
                                                            description: `Divination: ${reading.method}`,
                                                            metadata: { reading_method: reading.method }
                                                        })
                                                    });
                                                } catch (e) {
                                                    // Token award failure is non-critical
                                                }
                                            } else {
                                                const error = await res.json();
                                                alert(error.error || "Failed to save reading");
                                            }
                                        } catch (e) {
                                            alert("Failed to save reading");
                                        } finally {
                                            setIsSaving(false);
                                        }
                                    }}
                                    disabled={isSaving || saved}
                                    className={`px-6 py-3 font-bold rounded-full transition-colors flex items-center gap-2 ${
                                        saved
                                            ? "bg-green-600/20 text-green-400 border border-green-700/50 cursor-not-allowed"
                                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                                    }`}
                                >
                                    {saved ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Saved
                                        </>
                                    ) : isSaving ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Reading
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 text-center space-y-2">
                        <p className="text-zinc-400 text-sm">
                            Divination is a tool for reflection, not prediction. Use these readings to explore your inner landscape.
                        </p>
                        <p className="text-zinc-600 text-xs italic">
                            "The truth is hidden in plain sight. Seek and you shall find."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
