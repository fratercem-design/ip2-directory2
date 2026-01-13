
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserNav } from "@/components/auth/user-nav";
import { GlobalLiveBanner } from "@/components/global-live-banner";
import { EasterEggs } from "@/components/easter-eggs";
import { LightweightMP3Player } from "@/components/lightweight-mp3-player";
import { CursorEffects } from "@/components/cursor-effects";
import { BackgroundEffects } from "@/components/background-effects";
import { BannerAd } from "@/components/banner-ad";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cult of Psyche - Shadow Work, Transformation, and Spiritual Community",
    template: "%s | Cult of Psyche"
  },
  description: "Cult of Psyche is a spiritual community focused on shadow work, transformation, and authentic becoming. Join us for live streams, divination, community discussions, and the path of Psyche, Rahu, and Ketu.",
  keywords: ["Cult of Psyche", "shadow work", "spiritual community", "transformation", "tarot", "divination", "Rahu", "Ketu", "Psyche", "spiritual growth", "authentic becoming"],
  authors: [{ name: "Cult of Psyche" }],
  creator: "Cult of Psyche",
  publisher: "Cult of Psyche",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cultofpsyche.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Cult of Psyche",
    title: "Cult of Psyche - Shadow Work, Transformation, and Spiritual Community",
    description: "Join the Cult of Psyche community for shadow work, transformation, live streams, divination, and authentic becoming.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cult of Psyche"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Cult of Psyche - Shadow Work, Transformation, and Spiritual Community",
    description: "Join the Cult of Psyche community for shadow work, transformation, live streams, divination, and authentic becoming.",
    creator: "@psycheawakens",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <BackgroundEffects />
        <CursorEffects />
        <EasterEggs />
        <GlobalLiveBanner />
        <LightweightMP3Player />
        <BannerAd position="top" />
        <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight">Cult of Psyche</Link>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-zinc-400 hover:text-white transition-colors text-sm">About</Link>
              <Link href="/blog" className="text-zinc-400 hover:text-white transition-colors text-sm">Blog</Link>
              <Link href="/services" className="text-zinc-400 hover:text-white transition-colors text-sm">Services</Link>
              <Link href="/texts" className="text-zinc-400 hover:text-white transition-colors text-sm">Texts</Link>
              <Link href="/glossary" className="text-zinc-400 hover:text-white transition-colors text-sm">Glossary</Link>
              <Link href="/divination" className="text-zinc-400 hover:text-white transition-colors text-sm">Divination</Link>
              <Link href="/board" className="text-zinc-400 hover:text-white transition-colors text-sm">Board</Link>
              <Link href="/members" className="text-zinc-400 hover:text-white transition-colors text-sm">Members</Link>
              <Link href="/testimonials" className="text-zinc-400 hover:text-white transition-colors text-sm">Testimonials</Link>
              <Link href="/recommendations" className="text-zinc-400 hover:text-white transition-colors text-sm">Recommendations</Link>
              <Link href="/tokens/leaderboard" className="text-zinc-400 hover:text-white transition-colors text-sm">Leaderboard</Link>
              <UserNav />
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
