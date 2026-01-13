"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, DollarSign, Coins, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { supabasePublic } from "@/lib/supabase/public";
import { useRouter } from "next/navigation";

interface SaleSettings {
    exchange_rate: number;
    min_sale_amount: number;
    max_sale_amount: number | null;
    is_enabled: boolean;
}

interface Sale {
    id: string;
    tokens_amount: number;
    sale_price_usd: number;
    payment_method: string;
    payment_info: string;
    status: string;
    created_at: string;
}

export default function SellTokensPage() {
    const [settings, setSettings] = useState<SaleSettings | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [tokensAmount, setTokensAmount] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"cashapp" | "paypal" | "venmo" | "other">("cashapp");
    const [paymentInfo, setPaymentInfo] = useState<string>("");
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const db = supabasePublic();
        const { data: { session } } = await db.auth.getSession();

        if (!session) {
            router.push("/login?next=/tokens/sell");
            return;
        }

        try {
            // Load settings
            const settingsRes = await fetch("/api/tokens/sell/settings");
            if (settingsRes.ok) {
                const settingsData = await settingsRes.json();
                setSettings(settingsData);
            }

            // Load balance
            const balanceRes = await fetch("/api/tokens/balance");
            if (balanceRes.ok) {
                const balanceData = await balanceRes.json();
                setBalance(balanceData.balance || 0);
            }

            // Load sale history
            const salesRes = await fetch("/api/tokens/sell/history");
            if (salesRes.ok) {
                const salesData = await salesRes.json();
                setSales(salesData.sales || []);
            }
        } catch (e) {
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const calculatePrice = (tokens: number): number => {
        if (!settings || tokens <= 0) return 0;
        return tokens / settings.exchange_rate;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!tokensAmount || !paymentInfo) {
            setError("Please fill in all fields");
            return;
        }

        const amount = parseInt(tokensAmount);
        if (isNaN(amount) || amount <= 0) {
            setError("Please enter a valid token amount");
            return;
        }

        if (!settings) {
            setError("Settings not loaded. Please refresh.");
            return;
        }

        if (amount < settings.min_sale_amount) {
            setError(`Minimum sale amount is ${settings.min_sale_amount} tokens`);
            return;
        }

        if (settings.max_sale_amount && amount > settings.max_sale_amount) {
            setError(`Maximum sale amount is ${settings.max_sale_amount} tokens`);
            return;
        }

        if (amount > balance) {
            setError(`Insufficient balance. You have ${balance} tokens`);
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/tokens/sell", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tokens_amount: amount,
                    payment_method: paymentMethod,
                    payment_info: paymentInfo
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message || "Sale request created successfully!");
                setTokensAmount("");
                setPaymentInfo("");
                loadData(); // Reload to show new sale
            } else {
                setError(data.error || "Failed to create sale request");
            }
        } catch (e) {
            setError("Failed to create sale request");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-4 w-4 text-green-400" />;
            case "approved":
            case "processing":
                return <Clock className="h-4 w-4 text-blue-400" />;
            case "rejected":
            case "cancelled":
                return <XCircle className="h-4 w-4 text-red-400" />;
            default:
                return <Clock className="h-4 w-4 text-yellow-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "text-green-400 border-green-700/50";
            case "approved":
            case "processing":
                return "text-blue-400 border-blue-700/50";
            case "rejected":
            case "cancelled":
                return "text-red-400 border-red-700/50";
            default:
                return "text-yellow-400 border-yellow-700/50";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-zinc-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!settings || !settings.is_enabled) {
        return (
            <div className="min-h-screen bg-black text-white p-8">
                <div className="max-w-2xl mx-auto">
                    <Link href="/me" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Profile
                    </Link>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Token Sales Unavailable</h2>
                        <p className="text-zinc-400">Token sales are currently disabled. Please check back later.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/me" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Profile
                </Link>

                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                            <DollarSign className="h-8 w-8 text-emerald-400" />
                            Sell Tokens
                        </h1>
                        <p className="text-zinc-400">
                            Exchange rate: {settings.exchange_rate} tokens = $1.00
                        </p>
                    </div>

                    {/* Balance Display */}
                    <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-700/50 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Coins className="h-6 w-6 text-emerald-400" />
                                <div>
                                    <p className="text-sm text-zinc-400">Your Balance</p>
                                    <p className="text-3xl font-bold">{balance.toLocaleString()} tokens</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-zinc-400">Max Value</p>
                                <p className="text-2xl font-bold">${calculatePrice(balance).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sell Form */}
                    <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Token Amount
                            </label>
                            <input
                                type="number"
                                value={tokensAmount}
                                onChange={(e) => setTokensAmount(e.target.value)}
                                min={settings.min_sale_amount}
                                max={settings.max_sale_amount || balance}
                                placeholder={`Min: ${settings.min_sale_amount}, Max: ${settings.max_sale_amount || balance}`}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                            {tokensAmount && !isNaN(parseInt(tokensAmount)) && (
                                <p className="text-sm text-zinc-400 mt-2">
                                    You will receive: <span className="text-emerald-400 font-bold">${calculatePrice(parseInt(tokensAmount)).toFixed(2)}</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Payment Method
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value as any)}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            >
                                <option value="cashapp">Cash App</option>
                                <option value="paypal">PayPal</option>
                                <option value="venmo">Venmo</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-2">
                                Payment Info ({paymentMethod === "cashapp" ? "Cash App Tag" : paymentMethod === "paypal" ? "PayPal Email" : paymentMethod === "venmo" ? "Venmo Username" : "Payment Details"})
                            </label>
                            <input
                                type="text"
                                value={paymentInfo}
                                onChange={(e) => setPaymentInfo(e.target.value)}
                                placeholder={paymentMethod === "cashapp" ? "$yourcashtag" : paymentMethod === "paypal" ? "your@email.com" : paymentMethod === "venmo" ? "@username" : "Payment details"}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-600/20 border border-red-700/50 rounded-lg p-4 flex items-center gap-2 text-red-400">
                                <AlertCircle className="h-5 w-5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-600/20 border border-green-700/50 rounded-lg p-4 flex items-center gap-2 text-green-400">
                                <CheckCircle className="h-5 w-5" />
                                <p>{success}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting || !tokensAmount || !paymentInfo}
                            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Processing..." : "Create Sale Request"}
                        </button>

                        <p className="text-xs text-zinc-500 text-center">
                            Your tokens will be reserved until the sale is approved. You will receive payment within 1-3 business days after approval.
                        </p>
                    </form>

                    {/* Sale History */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Sale History</h2>
                        {sales.length === 0 ? (
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
                                No sales yet
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {sales.map((sale) => (
                                    <div
                                        key={sale.id}
                                        className={`bg-zinc-900/50 border rounded-xl p-4 ${getStatusColor(sale.status)}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(sale.status)}
                                                <span className="font-bold capitalize">{sale.status}</span>
                                            </div>
                                            <span className="text-sm text-zinc-400">
                                                {new Date(sale.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-zinc-500">Tokens</p>
                                                <p className="font-bold">{sale.tokens_amount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500">Amount</p>
                                                <p className="font-bold">${sale.sale_price_usd.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-500">Method</p>
                                                <p className="font-bold capitalize">{sale.payment_method}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
