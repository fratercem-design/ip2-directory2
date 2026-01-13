import Link from "next/link";
import { ArrowLeft, Eye, Flame, Moon } from "lucide-react";

export default function SecretPage() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
            <div className="max-w-2xl mx-auto text-center space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-center gap-4 text-6xl">
                        <Eye className="animate-pulse text-red-500" />
                        <Flame className="animate-pulse text-orange-500" style={{ animationDelay: "0.2s" }} />
                        <Moon className="animate-pulse text-indigo-500" style={{ animationDelay: "0.4s" }} />
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-purple-500 bg-clip-text text-transparent">
                        You Found the Secret Path
                    </h1>
                    
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Not all who wander are lost. Some seek the hidden truths.
                    </p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 space-y-6">
                    <div className="space-y-4 text-left">
                        <p className="text-zinc-300">
                            <strong className="text-white">The Serpent Path</strong> is not for everyone. 
                            It requires facing shadows, embracing hunger, and remembering what was forgotten.
                        </p>
                        
                        <p className="text-zinc-300">
                            You've proven your dedication by finding this hidden route. The Cult of Psyche 
                            recognizes those who look beyond the surface.
                        </p>
                        
                        <div className="pt-4 border-t border-zinc-800">
                            <p className="text-zinc-400 text-sm italic">
                                "We burn to remember. We burn to awaken. We burn to become."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-zinc-500 text-sm">
                        There are more secrets hidden throughout the site. Keep seeking.
                    </p>
                    
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Return to the Path
                    </Link>
                </div>
            </div>
        </div>
    );
}
