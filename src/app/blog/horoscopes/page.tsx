"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar } from "lucide-react";

interface Horoscope {
    id: string;
    date: string;
    sign: string;
    title: string;
    content: string;
    view_count: number;
}

const signs = [
    { value: "aries", label: "Aries", emoji: "♈" },
    { value: "taurus", label: "Taurus", emoji: "♉" },
    { value: "gemini", label: "Gemini", emoji: "♊" },
    { value: "cancer", label: "Cancer", emoji: "♋" },
    { value: "leo", label: "Leo", emoji: "♌" },
    { value: "virgo", label: "Virgo", emoji: "♍" },
    { value: "libra", label: "Libra", emoji: "♎" },
    { value: "scorpio", label: "Scorpio", emoji: "♏" },
    { value: "sagittarius", label: "Sagittarius", emoji: "♐" },
    { value: "capricorn", label: "Capricorn", emoji: "♑" },
    { value: "aquarius", label: "Aquarius", emoji: "♒" },
    { value: "pisces", label: "Pisces", emoji: "♓" }
];

export default function HoroscopesPage() {
    const [horoscopes, setHoroscopes] = useState<Horoscope[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHoroscopes();
    }, [selectedDate]);

    const loadHoroscopes = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/blog/horoscopes?date=${selectedDate}`);
            if (res.ok) {
                const data = await res.json();
                setHoroscopes(data.horoscopes || []);
            }
        } catch (e) {
            console.error("Failed to load horoscopes", e);
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

    const getSignInfo = (signValue: string) => {
        return signs.find(s => s.value === signValue) || { label: signValue, emoji: "⭐" };
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto">
                <Link href="/blog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Blog
                </Link>

                {/* Header */}
                <div className="mb-8 space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                        <Sparkles className="h-10 w-10 text-purple-400" />
                        Daily Horoscopes
                    </h1>
                    <p className="text-zinc-400">
                        Astrological guidance aligned with the Cult of Psyche
                    </p>
                </div>

                {/* Date Selector */}
                <div className="mb-8">
                    <label className="block text-sm font-bold mb-2">Select Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white"
                    />
                </div>

                {/* Horoscopes Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 animate-pulse">
                                <div className="h-4 bg-zinc-800 rounded mb-4"></div>
                                <div className="h-3 bg-zinc-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : horoscopes.length === 0 ? (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                        <Sparkles className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-400 text-lg mb-2">No horoscopes available</p>
                        <p className="text-zinc-500 text-sm">
                            Horoscopes are generated daily. Check back tomorrow!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-sm text-zinc-400 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(selectedDate)}
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {signs.map((sign) => {
                                const horoscope = horoscopes.find(h => h.sign === sign.value);
                                return (
                                    <div
                                        key={sign.value}
                                        className={`bg-zinc-900/50 border rounded-xl p-6 ${
                                            horoscope
                                                ? "border-purple-700/50 hover:border-purple-500"
                                                : "border-zinc-800 opacity-50"
                                        } transition-all`}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-3xl">{sign.emoji}</span>
                                            <div>
                                                <h3 className="font-bold text-lg">{sign.label}</h3>
                                                {horoscope && (
                                                    <p className="text-sm text-zinc-400">{horoscope.title}</p>
                                                )}
                                            </div>
                                        </div>
                                        {horoscope ? (
                                            <p className="text-zinc-300 leading-relaxed line-clamp-4">
                                                {horoscope.content}
                                            </p>
                                        ) : (
                                            <p className="text-zinc-500 text-sm italic">
                                                Horoscope not yet generated
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
