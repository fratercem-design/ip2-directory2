"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, BarChart3, FileText, Mail, Calendar, CheckCircle, Star, Users, TrendingUp } from "lucide-react";

interface Service {
    id: string;
    title: string;
    description: string;
    features: string[];
    price: string;
    category: "marketing" | "tarot";
    icon: React.ReactNode;
    popular?: boolean;
}

const services: Service[] = [
    {
        id: "tarot-reading",
        title: "Personal Tarot Reading",
        description: "A comprehensive tarot reading tailored to your questions and concerns. Receive detailed insights and guidance aligned with the Cult of Psyche philosophy.",
        features: [
            "3-card spread or custom spread",
            "Detailed written interpretation",
            "Shadow work insights",
            "Practical guidance",
            "Digital delivery within 48 hours"
        ],
        price: "$25",
        category: "tarot",
        icon: <Sparkles className="h-6 w-6" />,
        popular: true
    },
    {
        id: "extended-tarot",
        title: "Extended Tarot Report",
        description: "An in-depth tarot reading with multiple spreads, comprehensive analysis, and ongoing guidance. Perfect for complex questions or life transitions.",
        features: [
            "Multiple card spreads",
            "Comprehensive written report (5-10 pages)",
            "Timeline analysis",
            "Shadow work integration",
            "Follow-up support",
            "Digital delivery within 72 hours"
        ],
        price: "$75",
        category: "tarot",
        icon: <FileText className="h-6 w-6" />,
        popular: false
    },
    {
        id: "monthly-tarot",
        title: "Monthly Tarot Guidance",
        description: "Receive a monthly tarot reading at the beginning of each month, providing guidance and insights for the month ahead.",
        features: [
            "Monthly tarot reading",
            "Month-ahead guidance",
            "Astrological insights",
            "Shadow work themes",
            "Email delivery on 1st of month",
            "3-month minimum commitment"
        ],
        price: "$60/month",
        category: "tarot",
        icon: <Calendar className="h-6 w-6" />,
        popular: false
    },
    {
        id: "marketing-consultation",
        title: "Marketing Consultation",
        description: "One-on-one consultation to develop your marketing strategy, brand positioning, and growth plan aligned with your values.",
        features: [
            "1-hour consultation call",
            "Brand strategy review",
            "Marketing plan development",
            "Content strategy guidance",
            "Social media recommendations",
            "Follow-up email summary"
        ],
        price: "$150",
        category: "marketing",
        icon: <BarChart3 className="h-6 w-6" />,
        popular: true
    },
    {
        id: "marketing-audit",
        title: "Marketing Audit & Report",
        description: "Comprehensive analysis of your current marketing efforts with detailed recommendations and action plan.",
        features: [
            "Full marketing audit",
            "Competitor analysis",
            "Brand positioning review",
            "Content analysis",
            "Detailed written report (10-15 pages)",
            "30-minute review call"
        ],
        price: "$300",
        category: "marketing",
        icon: <FileText className="h-6 w-6" />,
        popular: false
    },
    {
        id: "ongoing-marketing",
        title: "Ongoing Marketing Support",
        description: "Monthly marketing support including strategy, content planning, and performance review. Perfect for growing businesses.",
        features: [
            "Monthly strategy sessions",
            "Content planning & review",
            "Performance analysis",
            "Marketing recommendations",
            "Email support",
            "Quarterly reports"
        ],
        price: "$400/month",
        category: "marketing",
        icon: <TrendingUp className="h-6 w-6" />,
        popular: false
    }
];

export default function ServicesPage() {
    const marketingServices = services.filter(s => s.category === "marketing");
    const tarotServices = services.filter(s => s.category === "tarot");

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Sparkles className="h-10 w-10 text-purple-400" />
                            Services
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Marketing services and tarot reports to support your journey and growth
                        </p>
                    </div>

                    {/* Tarot Reports Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                            <h2 className="text-3xl font-bold flex items-center gap-2">
                                <Sparkles className="h-8 w-8 text-purple-400" />
                                Tarot Reports
                            </h2>
                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                        </div>

                        <p className="text-zinc-400 text-center max-w-2xl mx-auto">
                            Receive personalized tarot readings aligned with the Cult of Psyche philosophy. 
                            Each reading integrates shadow work, the Serpent Path, and guidance from Rahu and Ketu.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tarotServices.map((service) => (
                                <div
                                    key={service.id}
                                    className={`bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border rounded-xl p-6 relative ${
                                        service.popular
                                            ? "border-purple-500 ring-2 ring-purple-500/50"
                                            : "border-purple-700/50"
                                    } hover:border-purple-500 transition-all hover:scale-105`}
                                >
                                    {service.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-purple-400">{service.icon}</div>
                                        <h3 className="text-xl font-bold">{service.title}</h3>
                                    </div>

                                    <p className="text-zinc-300 mb-4 leading-relaxed text-sm">
                                        {service.description}
                                    </p>

                                    <div className="space-y-2 mb-6">
                                        {service.features.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-zinc-400">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-purple-700/50">
                                        <div>
                                            <div className="text-2xl font-bold text-purple-300">{service.price}</div>
                                        </div>
                                        <a
                                            href={`mailto:psycheawakens@gmail.com?subject=Service Inquiry: ${service.title}`}
                                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors text-sm"
                                        >
                                            Book Now
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Marketing Services Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                            <h2 className="text-3xl font-bold flex items-center gap-2">
                                <BarChart3 className="h-8 w-8 text-blue-400" />
                                Marketing Services
                            </h2>
                            <div className="h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent flex-1"></div>
                        </div>

                        <p className="text-zinc-400 text-center max-w-2xl mx-auto">
                            Strategic marketing services to help you grow your brand, reach your audience, 
                            and build authentic connections. Services aligned with values-based marketing.
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {marketingServices.map((service) => (
                                <div
                                    key={service.id}
                                    className={`bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border rounded-xl p-6 relative ${
                                        service.popular
                                            ? "border-blue-500 ring-2 ring-blue-500/50"
                                            : "border-blue-700/50"
                                    } hover:border-blue-500 transition-all hover:scale-105`}
                                >
                                    {service.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="text-blue-400">{service.icon}</div>
                                        <h3 className="text-xl font-bold">{service.title}</h3>
                                    </div>

                                    <p className="text-zinc-300 mb-4 leading-relaxed text-sm">
                                        {service.description}
                                    </p>

                                    <div className="space-y-2 mb-6">
                                        {service.features.map((feature, index) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-zinc-400">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-blue-700/50">
                                        <div>
                                            <div className="text-2xl font-bold text-blue-300">{service.price}</div>
                                        </div>
                                        <a
                                            href={`mailto:psycheawakens@gmail.com?subject=Service Inquiry: ${service.title}`}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"
                                        >
                                            Book Now
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Process Section */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                                    <Mail className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-bold">1. Contact</h3>
                                <p className="text-sm text-zinc-400">
                                    Reach out via email with your service inquiry and any questions
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-bold">2. Schedule</h3>
                                <p className="text-sm text-zinc-400">
                                    We'll coordinate timing and discuss your specific needs
                                </p>
                            </div>
                            <div className="text-center space-y-3">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                                    <Star className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-bold">3. Receive</h3>
                                <p className="text-sm text-zinc-400">
                                    Get your tarot report or marketing service delivered as promised
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Testimonials */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold text-center">What Clients Say</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-zinc-300 mb-4 italic">
                                    "The tarot reading was incredibly insightful and helped me understand aspects of my shadow work I hadn't considered. The guidance was practical and profound."
                                </p>
                                <p className="text-sm text-zinc-500">— Anonymous Client</p>
                            </div>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-zinc-300 mb-4 italic">
                                    "The marketing consultation transformed how I approach my brand. The strategy was aligned with my values and helped me connect authentically with my audience."
                                </p>
                                <p className="text-sm text-zinc-500">— Anonymous Client</p>
                            </div>
                        </div>
                    </section>

                    {/* Contact CTA */}
                    <section className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-700/50 rounded-xl p-8 text-center space-y-4">
                        <h2 className="text-2xl font-bold">Ready to Begin?</h2>
                        <p className="text-zinc-300 max-w-2xl mx-auto">
                            Whether you're seeking tarot guidance or marketing support, we're here to help. 
                            Reach out to discuss your needs and find the right service for you.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <a
                                href="mailto:psycheawakens@gmail.com?subject=Service Inquiry"
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-colors flex items-center gap-2"
                            >
                                <Mail className="h-5 w-5" />
                                Contact Us
                            </a>
                            <Link
                                href="/about"
                                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full transition-colors"
                            >
                                Learn More
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
