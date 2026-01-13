import Link from "next/link";
import { ArrowLeft, ShoppingBag, ExternalLink } from "lucide-react";
import { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { generateStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
    title: "About Cult of Psyche - Shadow Work, Transformation, and Spiritual Community",
    description: "Learn about Cult of Psyche, a spiritual community focused on shadow work, transformation, and authentic becoming. Discover our philosophy, founder, and the path of Psyche, Rahu, and Ketu.",
    keywords: ["Cult of Psyche", "about", "shadow work", "spiritual community", "transformation", "Rahu", "Ketu", "Psyche", "founder"],
    openGraph: {
        title: "About Cult of Psyche - Shadow Work and Transformation",
        description: "Learn about Cult of Psyche, a spiritual community focused on shadow work, transformation, and authentic becoming.",
        type: "website",
        images: ["/og-image.jpg"]
    }
};

export default function AboutPage() {
    const organizationData = generateStructuredData("Organization", {});
    return (
        <>
            <StructuredData data={organizationData} />
            <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto p-8">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="space-y-16">
                    {/* Header */}
                    <div className="text-center space-y-4 relative">
                        <h1 className="text-5xl font-bold tracking-tight">About Cult of Psyche</h1>
                        <p className="text-zinc-400 text-lg">The Path of Shadow, Flame, and Becoming</p>
                        {/* Hidden message - select text to reveal */}
                        <p className="text-transparent text-[1px] select-text hover:text-zinc-600 transition-colors cursor-default mt-2" title="The path is hidden...">
                            Twelve gates. One truth. Seek the pattern.
                        </p>
                    </div>

                    {/* Founder Biography */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                            <h2 className="text-3xl font-bold text-red-500">Founder Biography</h2>
                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                        </div>
                        
                        <div className="prose prose-invert max-w-none space-y-4 text-zinc-300 leading-relaxed">
                            <p className="text-lg font-medium">
                                I'm Psyche — a host, reader, builder, and professional pattern-noticer.
                            </p>
                            
                            <p>
                                I run long-form live panels with unusual guests, real conversations, and the occasional chaos goblin in the audience. I read tarot, study the occult, and treat symbolism the way engineers treat data: as signals worth investigating.
                            </p>
                            
                            <p>
                                Cult of Psyche is not a "cult" in the coercive sense. It's a tongue-in-cheek banner for people who are tired of fake certainty and hungry for honest transformation. No worship. No obedience. No guru stuff. Just a shared language for shadow, flame, and becoming.
                            </p>
                            
                            <p>
                                If you've ever felt too intense, too weird, too curious, too honest—good. You're in the right place. We don't polish the truth here. We refine it.
                            </p>
                            
                            <p className="text-zinc-400 italic">
                                Based in Los Angeles, I built this to protect the signal and make transformation feel real again.
                            </p>
                        </div>
                    </section>

                    {/* Founding of the Cult */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                            <h2 className="text-3xl font-bold text-indigo-400">The Founding of the Cult</h2>
                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                        </div>
                        
                        <div className="prose prose-invert max-w-none space-y-4 text-zinc-300 leading-relaxed">
                            <p className="text-lg font-medium">
                                Cult of Psyche began as a response to a very modern problem: too much noise, too little meaning.
                            </p>
                            
                            <p>
                                I was watching people get flattened by algorithms, mobs, and performative morality—while real questions went unanswered. So I built a container: a signal inside the static. A place where myth and psychology can sit at the same table. A place where the strange isn't punished, and the honest isn't mocked.
                            </p>
                            
                            <p>
                                The "cult" name is a wink and a warning: a wink because it's theatrical, and a warning because we take devotion seriously—devotion to growth, to discernment, to personal sovereignty. If you're looking for a leader to think for you, this isn't it. If you're looking for a path that helps you think more clearly, feel more deeply, and become more yourself… welcome.
                            </p>
                        </div>
                    </section>

                    {/* Philosophy Section */}
                    <section className="space-y-6 border-t border-zinc-800 pt-12">
                        <h2 className="text-3xl font-bold text-yellow-500">Our Philosophy</h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-red-400">The Serpent Path</h3>
                                <p className="text-zinc-400">
                                    We walk the path between Rahu (Hunger) and Ketu (Memory), guided by the First Flame 
                                    of Psyche. This is a path of shadow work, truth-seeking, and authentic becoming.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-indigo-400">The Twelve Lineages</h3>
                                <p className="text-zinc-400">
                                    Each seeker resonates with one of the Twelve Lineages - from Mask-Breaker to Tidewalker. 
                                    These are not roles to play, but truths to discover within ourselves.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-purple-400">Shadow Work</h3>
                                <p className="text-zinc-400">
                                    We do not hide from our shadows. We face them, learn from them, and integrate them. 
                                    The Lunar Mirror shows us what we refuse to see, and we choose to look.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-green-400">Authentic Becoming</h3>
                                <p className="text-zinc-400">
                                    This is not about becoming someone else, but becoming more fully ourselves. We burn 
                                    to remember, to awaken, to become - not to escape, but to embody.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Community Section */}
                    <section className="space-y-6 border-t border-zinc-800 pt-12">
                        <h2 className="text-3xl font-bold text-emerald-400">Join the Signal</h2>
                        
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 space-y-4">
                            <p className="text-zinc-300 leading-relaxed">
                                Cult of Psyche is more than a stream or a philosophy - it's a community of seekers walking 
                                the path together. We gather in the flames, share in the shadows, and support each other's 
                                becoming.
                            </p>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="/"
                                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                                >
                                    Watch Live
                                </Link>
                                <Link
                                    href="/texts"
                                    className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors"
                                >
                                    Read Liturgical Texts
                                </Link>
                                <Link
                                    href="/streamer/cult-of-psyche"
                                    className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-full hover:bg-zinc-700 transition-colors"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Support Section */}
                    <section className="space-y-6 border-t border-zinc-800 pt-12">
                        <h2 className="text-3xl font-bold text-emerald-500">Support the Work</h2>
                        
                        <div className="space-y-6">
                            {/* Cash App */}
                            <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 border border-emerald-700/50 rounded-xl p-8">
                                <p className="text-zinc-300 mb-6 leading-relaxed">
                                    If this path resonates with you and you'd like to support the work, consider contributing 
                                    via Cash App. Your support helps sustain the streams, the community, and the continued 
                                    development of this path.
                                </p>
                                
                                <a
                                    href="https://cash.app/$psycheawakens"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
                                >
                                    <span>💚 Support via Cash App</span>
                                    <span className="font-mono text-emerald-100">$psycheawakens</span>
                                </a>
                            </div>

                            {/* Etsy Shop */}
                            <div className="bg-gradient-to-r from-orange-600/20 to-red-500/20 border border-orange-700/50 rounded-xl p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <ShoppingBag className="h-8 w-8 text-orange-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-2xl font-bold text-orange-300 mb-2">Psyche Awakens Shop</h3>
                                        <p className="text-zinc-300 leading-relaxed">
                                            Visit our official Etsy shop for spiritual items, ritual tools, divination supplies, 
                                            and handcrafted items aligned with the path. Each purchase supports the community 
                                            and provides tools for your journey.
                                        </p>
                                    </div>
                                </div>
                                
                                <a
                                    href="https://psycheawakens.etsy.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    <span>Visit Etsy Shop</span>
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </>
    );
}
