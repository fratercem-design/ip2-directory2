import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LiturgicalTexts() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Directory
            </Link>

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4 relative">
                    <h1 className="text-5xl font-bold tracking-tight">🔱 THE LITURGICAL TEXTS OF THE KULT OF PSYCHE</h1>
                    <p className="text-zinc-400 text-lg">Hymns, Invocations, Chants, and Spoken Rites</p>
                    {/* Hidden easter egg - invisible link */}
                    <a 
                        href="/secret" 
                        className="absolute top-0 left-1/2 w-1 h-1 opacity-0 hover:opacity-100 transition-opacity"
                        aria-label="Hidden path"
                    >
                        <span className="sr-only">Secret path</span>
                    </a>
                </div>

                {/* I. THE FIRE LITANY */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-red-500">🔥 I. THE FIRE LITANY</h2>
                    <p className="text-zinc-400 italic">Recited to open rituals, streams, and gatherings.</p>
                    <div className="space-y-4 text-lg leading-relaxed">
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Before the flame, we stand unmasked."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"We are what the fire reveals."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Shadow within, shadow without."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"We rise through both."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Hunger of Rahu, teach us desire."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"Memory of Ketu, teach us release."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Psyche, First Flame, Mirror King—"</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"Walk with us through our becoming."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">All:</p>
                            <p className="text-zinc-300">"We burn to remember.<br />We burn to awaken.<br />We burn to become."</p>
                        </div>
                    </div>
                </section>

                {/* II. THE LUNAR MIRROR INVOCATION */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-indigo-400">🌑 II. THE LUNAR MIRROR INVOCATION</h2>
                    <p className="text-zinc-400 italic">Used for introspection, emotional clarity, shadow work.</p>
                    <div className="text-lg leading-relaxed text-zinc-300 space-y-4">
                        <p>"Moon of memory,<br />Moon of reflection,<br />Moon that holds the faces we refuse to see—<br />Open the Mirror.</p>
                        <p>Show us the grief we hid,<br />the truth we buried,<br />the fear we swallowed,<br />the self we abandoned.</p>
                        <p>Let the Shadow Body speak.<br />Let the Four Rivers flow.</p>
                        <p>By your silver gaze, we remember.<br />By your stillness, we heal."</p>
                    </div>
                </section>

                {/* III. THE SERPENT OATH HYMNAL */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-green-500">🜁 III. THE SERPENT OATH HYMNAL</h2>
                    <p className="text-zinc-400 italic">Call-and-response fashion, used in initiations or high ritual.</p>
                    <div className="space-y-4 text-lg leading-relaxed">
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Rahu—Serpent of Hunger, open your mouth."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"We face our desire."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Ketu—Serpent of Memory, open your eye."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"We face our truth."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Fire of Psyche, rise between them."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"We walk the path of becoming."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">All:</p>
                            <p className="text-zinc-300">"Devoured but not destroyed.<br />Forgotten but not erased.<br />Shadow-borne, Flame-forged—<br />We ascend."</p>
                        </div>
                    </div>
                </section>

                {/* IV. THE TWELVE LINEAGE CHANTS */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-yellow-500">🜂 IV. THE TWELVE LINEAGE CHANTS</h2>
                    <p className="text-zinc-400 italic">Used to awaken personal lineage resonance. Repeat softly like a mantra.</p>
                    <div className="space-y-4 text-lg">
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">1. Mask-Breaker</p>
                            <p className="text-zinc-300 italic">"Truth before comfort."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">2. Hunger-Tamer</p>
                            <p className="text-zinc-300 italic">"I choose what chooses me."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">3. Witness of Mirrors</p>
                            <p className="text-zinc-300 italic">"I see what is."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">4. Keeper of the Wound</p>
                            <p className="text-zinc-300 italic">"I feel and heal."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">5. Lion Without Crown</p>
                            <p className="text-zinc-300 italic">"I shine without domination."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">6. Imperfect Saint</p>
                            <p className="text-zinc-300 italic">"I refine, not erase."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">7. Balancer of Hearts</p>
                            <p className="text-zinc-300 italic">"Honesty is harmony."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">8. Serpent-Souled</p>
                            <p className="text-zinc-300 italic">"I descend to ascend."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">9. Wanderer of Flames</p>
                            <p className="text-zinc-300 italic">"My aim carves my path."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">10. Bearer of Burden</p>
                            <p className="text-zinc-300 italic">"I endure and complete."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">11. Storm-Mind</p>
                            <p className="text-zinc-300 italic">"Rebellion births evolution."</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <p className="font-bold text-white">12. Tidewalker</p>
                            <p className="text-zinc-300 italic">"I become everything."</p>
                        </div>
                    </div>
                </section>

                {/* V. THE CORONATION HYMN */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-purple-500">🜄 V. THE CORONATION HYMN</h2>
                    <p className="text-zinc-400 italic">Used in high ceremonies or major announcements; speaks of Book IX.</p>
                    <div className="text-lg leading-relaxed text-zinc-300 space-y-4">
                        <p>"Crown of Shadow,<br />Crown of Flame,<br />Crown of the Serpent Path—<br />We witness your becoming.</p>
                        <p>You rose through hunger,<br />You rose through memory,<br />You rose through wounds that taught instead of broke.</p>
                        <p>Psyche, Mirror King—<br />Where you burn, we ignite.<br />Where you rise, we follow.<br />Where you remember, we awaken."</p>
                    </div>
                </section>

                {/* VI. THE GATE-OPENING RITUAL */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-orange-500">🔥 VI. THE GATE-OPENING RITUAL (SHORT FORM)</h2>
                    <p className="text-zinc-400 italic">Used at the start of an event, panel, or meditation.</p>
                    <div className="space-y-4 text-lg leading-relaxed">
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Gate of Fire, open."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"We stand unmasked."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Gate of Shadow, open."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"We face our truth."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Leader:</p>
                            <p className="text-zinc-300">"Gate of Becoming, open."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">Responders:</p>
                            <p className="text-zinc-300">"We walk forward."</p>
                        </div>
                        <div>
                            <p className="font-bold text-white mb-2">All:</p>
                            <p className="text-zinc-300">"The Twelve Gates turn.<br />The path begins."</p>
                        </div>
                    </div>
                </section>

                {/* VII. THE RITE OF RELEASE */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-blue-400">🌒 VII. THE RITE OF RELEASE</h2>
                    <p className="text-zinc-400 italic">Used to cleanse anxiety, betrayal, or emotional heaviness.</p>
                    <div className="text-lg leading-relaxed text-zinc-300 space-y-4">
                        <p>"Ketu, silent serpent,<br />Cut the thread that binds me to yesterday.<br />Let the memory keep its lesson<br />but surrender its weight.</p>
                        <p>I walk unburdened.<br />I walk awake.<br />I walk in truth."</p>
                    </div>
                </section>

                {/* VIII. THE RITE OF IGNITION */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-red-500">⚡ VIII. THE RITE OF IGNITION</h2>
                    <p className="text-zinc-400 italic">Used before big decisions, creative breakthroughs, or psychic workings.</p>
                    <div className="text-lg leading-relaxed text-zinc-300">
                        <p>"Rahu, roaring serpent—<br />Show me my hunger without shame.<br />Psyche, guiding flame—<br />Shape my hunger into direction.<br />Let desire become destiny."</p>
                    </div>
                </section>

                {/* IX. THE FINAL FIRE BENEDICTION */}
                <section className="space-y-6 border border-zinc-800 rounded-xl p-8 bg-zinc-900/20">
                    <h2 className="text-3xl font-bold text-red-600">🔱 IX. THE FINAL FIRE BENEDICTION</h2>
                    <p className="text-zinc-400 italic">Used to close ceremonies, streams, or sacred spaces.</p>
                    <div className="text-lg leading-relaxed text-zinc-300 space-y-4">
                        <p>"As the Fire dims, we remain lit.<br />As the Shadow falls, we remain aware.<br />As the path twists, we remain steady.</p>
                        <p>Psyche walks with us.<br />We walk with ourselves.</p>
                        <p>And so the Flame continues."</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
