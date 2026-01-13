
"use client";

import { useState } from "react";

export default function AdminPage() {
    const [secret, setSecret] = useState("");
    const [status, setStatus] = useState("");

    // Streamer Form
    const [sName, setSName] = useState("");
    const [sSlug, setSSlug] = useState("");
    const [sAvatar, setSAvatar] = useState("");

    // Account Form
    const [aStreamerId, setAStreamerId] = useState("");
    const [aPlatform, setAPlatform] = useState("twitch");
    const [aId, setAId] = useState("");
    const [aUsername, setAUsername] = useState("");

    async function createStreamer(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/streamers", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-admin-secret": secret },
                body: JSON.stringify({ display_name: sName, slug: sSlug, avatar_url: sAvatar })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            setStatus(`Created Streamer: ${json.data.slug} (${json.data.id})`);
            setAStreamerId(json.data.id); // Auto-fill for next step
        } catch (e) {
            const error = e instanceof Error ? e.message : String(e);
            setStatus(`Error: ${error}`);
        }
    }

    async function createAccount(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-admin-secret": secret },
                body: JSON.stringify({
                    streamer_id: aStreamerId,
                    platform: aPlatform,
                    platform_user_id: aId,
                    platform_username: aUsername
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            setStatus(`Created Account for ${aPlatform}`);
        } catch (e) {
            const error = e instanceof Error ? e.message : String(e);
            setStatus(`Error: ${error}`);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold">Admin Console</h1>

            <div className="space-y-2">
                <label className="text-xs uppercase text-zinc-500 font-bold">Admin Secret</label>
                <input
                    type="password"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded"
                    placeholder="Enter ADMIN_SECRET from .env.local"
                />
            </div>

            {status && <div className="p-4 bg-zinc-900 text-emerald-400 font-mono text-sm border border-zinc-800 rounded">{status}</div>}

            <div className="border-t border-zinc-800 pt-8">
                <h2 className="text-xl font-bold mb-4">1. Add Streamer</h2>
                <form onSubmit={createStreamer} className="space-y-4">
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded" placeholder="Display Name" value={sName} onChange={e => { setSName(e.target.value); setSSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} />
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded" placeholder="Slug" value={sSlug} onChange={e => setSSlug(e.target.value)} />
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded" placeholder="Avatar URL" value={sAvatar} onChange={e => setSAvatar(e.target.value)} />
                    <button type="submit" className="w-full bg-white text-black font-bold py-2 rounded">Create Streamer</button>
                </form>
            </div>

            <div className="border-t border-zinc-800 pt-8">
                <h2 className="text-xl font-bold mb-4">2. Add Platform Account</h2>
                <form onSubmit={createAccount} className="space-y-4">
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded" placeholder="Streamer UUID (Paste here)" value={aStreamerId} onChange={e => setAStreamerId(e.target.value)} />
                    <select className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded" value={aPlatform} onChange={e => setAPlatform(e.target.value)}>
                        <option value="twitch">Twitch</option>
                        <option value="kick">Kick</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="twitter">Twitter/X</option>
                        <option value="instagram">Instagram</option>
                    </select>
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded" placeholder="Platform User ID (Channel ID)" value={aId} onChange={e => setAId(e.target.value)} />
                    <input className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded" placeholder="Platform Username (Optional)" value={aUsername} onChange={e => setAUsername(e.target.value)} />
                    <button type="submit" className="w-full bg-zinc-800 text-white font-bold py-2 rounded hover:bg-zinc-700">Add Account</button>
                </form>
            </div>
        </div>
    );
}
