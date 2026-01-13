"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Eye, MousePointerClick, Calendar, Settings, Image as ImageIcon } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";

interface Campaign {
    id: string;
    name: string;
    description: string | null;
    advertiser_name: string | null;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
}

interface Ad {
    id: string;
    campaign_id: string;
    title: string;
    image_url: string;
    link_url: string;
    alt_text: string | null;
    ad_size: string;
    position: string;
    target_pages: string[] | null;
    is_active: boolean;
    priority: number;
    start_date: string | null;
    end_date: string | null;
    max_impressions: number | null;
    max_clicks: number | null;
    current_impressions: number;
    current_clicks: number;
    created_at: string;
}

export default function AdsAdminPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
        loadData();
    }, []);

    const checkAuth = async () => {
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();
        // Add admin check here - for now just check if logged in
        if (!session) {
            router.push("/login?next=/admin/ads");
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const db = supabasePublic();
            
            // Load campaigns
            const { data: campaignsData } = await db
                .from("ad_campaigns")
                .select("*")
                .order("created_at", { ascending: false });
            setCampaigns(campaignsData || []);

            // Load ads
            const { data: adsData } = await db
                .from("banner_ads")
                .select("*")
                .order("created_at", { ascending: false });
            setAds(adsData || []);

        } catch (e) {
            console.error("Failed to load data", e);
        } finally {
            setLoading(false);
        }
    };

    const calculateCTR = (impressions: number, clicks: number) => {
        if (impressions === 0) return 0;
        return ((clicks / impressions) * 100).toFixed(2);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                <div className="text-zinc-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Admin
                </Link>

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                            <ImageIcon className="h-10 w-10 text-purple-400" />
                            Banner Ads Management
                        </h1>
                        <p className="text-zinc-400 mt-2">
                            Manage advertising campaigns and banner ads
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        New Ad
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <div className="text-sm text-zinc-400 mb-1">Total Campaigns</div>
                        <div className="text-3xl font-bold">{campaigns.length}</div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <div className="text-sm text-zinc-400 mb-1">Active Ads</div>
                        <div className="text-3xl font-bold">{ads.filter(a => a.is_active).length}</div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <div className="text-sm text-zinc-400 mb-1">Total Impressions</div>
                        <div className="text-3xl font-bold">
                            {ads.reduce((sum, ad) => sum + ad.current_impressions, 0).toLocaleString()}
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                        <div className="text-sm text-zinc-400 mb-1">Total Clicks</div>
                        <div className="text-3xl font-bold">
                            {ads.reduce((sum, ad) => sum + ad.current_clicks, 0).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Ads List */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Banner Ads</h2>
                    {ads.length === 0 ? (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                            <ImageIcon className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                            <p className="text-zinc-400 text-lg mb-2">No ads created yet</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
                            >
                                Create First Ad
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {ads.map((ad) => {
                                const campaign = campaigns.find(c => c.id === ad.campaign_id);
                                const ctr = calculateCTR(ad.current_impressions, ad.current_clicks);
                                
                                return (
                                    <div
                                        key={ad.id}
                                        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-600/50 transition-colors"
                                    >
                                        <div className="flex items-start gap-6">
                                            {/* Ad Image Preview */}
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={ad.image_url}
                                                    alt={ad.alt_text || ad.title}
                                                    className="w-32 h-32 object-cover rounded-lg bg-zinc-800"
                                                />
                                            </div>

                                            {/* Ad Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-lg mb-1">{ad.title}</h3>
                                                        <p className="text-sm text-zinc-400">
                                                            Campaign: {campaign?.name || "Unknown"}
                                                        </p>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                        ad.is_active
                                                            ? "bg-green-600/20 text-green-400 border border-green-700/50"
                                                            : "bg-zinc-800 text-zinc-500"
                                                    }`}>
                                                        {ad.is_active ? "Active" : "Inactive"}
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                                                    <div>
                                                        <span className="text-zinc-500">Position:</span>{" "}
                                                        <span className="text-zinc-300 capitalize">{ad.position}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-zinc-500">Size:</span>{" "}
                                                        <span className="text-zinc-300 capitalize">{ad.ad_size}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-zinc-500">Priority:</span>{" "}
                                                        <span className="text-zinc-300">{ad.priority}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-zinc-500">Link:</span>{" "}
                                                        <a
                                                            href={ad.link_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-purple-400 hover:text-purple-300 truncate block"
                                                        >
                                                            {ad.link_url}
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Stats */}
                                                <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-zinc-800">
                                                    <div className="flex items-center gap-2">
                                                        <Eye className="h-4 w-4 text-blue-400" />
                                                        <div>
                                                            <div className="text-xs text-zinc-500">Impressions</div>
                                                            <div className="font-bold text-blue-400">
                                                                {ad.current_impressions.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MousePointerClick className="h-4 w-4 text-green-400" />
                                                        <div>
                                                            <div className="text-xs text-zinc-500">Clicks</div>
                                                            <div className="font-bold text-green-400">
                                                                {ad.current_clicks.toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-zinc-500">CTR</div>
                                                        <div className="font-bold text-yellow-400">
                                                            {ctr}%
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-zinc-500">Status</div>
                                                        <div className="text-sm">
                                                            {ad.max_impressions && ad.current_impressions >= ad.max_impressions
                                                                ? "Limit Reached"
                                                                : ad.max_clicks && ad.current_clicks >= ad.max_clicks
                                                                ? "Clicks Limit"
                                                                : "Running"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
