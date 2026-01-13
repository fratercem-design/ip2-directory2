
"use client";

import { useEffect, useState } from "react";
import { supabasePublic } from "@/lib/supabase/public";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { TokenDisplay } from "@/components/tokens/token-display";

export function UserNav() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const db = supabasePublic();

    useEffect(() => {
        // Check active session
        db.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes (login/logout)
        const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return <div className="text-zinc-500 text-xs">...</div>;

    if (!user) {
        return (
            <Link href="/login" className="text-sm font-bold bg-white text-black px-4 py-2 rounded hover:bg-zinc-200 transition-colors">
                Log In
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <TokenDisplay compact />
            <Link href="/me" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    {user.email?.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-zinc-300 hidden md:block">{user.email}</span>
            </Link>
            <button
                onClick={() => db.auth.signOut()}
                className="text-zinc-400 hover:text-white p-2"
                title="Sign Out"
            >
                <LogOut className="w-4 h-4" />
            </button>
        </div>
    );
}
