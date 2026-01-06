
"use client";

import { useState } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const db = supabasePublic();
        const { error } = await db.auth.signInWithOtp({
            email,
            options: {
                // Redirect back to home after login
                emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-black">
                <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-xl text-center space-y-4">
                    <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Check your email</h1>
                    <p className="text-zinc-400">
                        We sent a magic link to <strong className="text-white">{email}</strong>.<br />
                        Click it to sign in.
                    </p>
                    <Link href="/" className="inline-block text-sm text-zinc-500 hover:text-white underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-xl space-y-6">
                <div className="space-y-2">
                    <Link href="/" className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 mb-4">
                        <ArrowLeft className="w-3 h-3" /> Back
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Sign In</h1>
                    <p className="text-zinc-400">Enter your email to receive a magic link.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="w-full bg-black border border-zinc-800 rounded p-3 text-white focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-3 rounded hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Sending..." : "Send Magic Link"}
                    </button>
                </form>
            </div>
        </div>
    );
}
