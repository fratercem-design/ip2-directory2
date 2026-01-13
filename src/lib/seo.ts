import { Metadata } from "next";

interface SEOProps {
    title: string;
    description: string;
    path?: string;
    image?: string;
    type?: "website" | "article" | "profile";
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
}

export function generateMetadata({
    title,
    description,
    path = "",
    image,
    type = "website",
    publishedTime,
    modifiedTime,
    author,
    tags
}: SEOProps): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cultofpsyche.com";
    const url = `${baseUrl}${path}`;
    const imageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/og-image.jpg`;

    const metadata: Metadata = {
        title: `${title} | Cult of Psyche`,
        description,
        openGraph: {
            title,
            description,
            url,
            siteName: "Cult of Psyche",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title
                }
            ],
            type: type === "article" ? "article" : "website",
            locale: "en_US"
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
            creator: "@psycheawakens"
        },
        alternates: {
            canonical: url
        }
    };

    if (type === "article" && publishedTime) {
        metadata.openGraph = {
            ...metadata.openGraph,
            type: "article",
            publishedTime,
            modifiedTime,
            authors: author ? [author] : undefined,
            tags: tags
        };
    }

    return metadata;
}

export function generateStructuredData(type: "Organization" | "WebSite" | "Article" | "Person", data: any) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cultofpsyche.com";

    const baseStructuredData = {
        "@context": "https://schema.org",
        "@type": type
    };

    switch (type) {
        case "Organization":
            return {
                ...baseStructuredData,
                name: "Cult of Psyche",
                url: baseUrl,
                logo: `${baseUrl}/logo.png`,
                description: "A spiritual community focused on shadow work, transformation, and authentic becoming",
                sameAs: [
                    "https://www.youtube.com/@cultofpsyche",
                    "https://www.tiktok.com/@cultofpsyche",
                    "https://twitter.com/psycheawakens",
                    "https://www.instagram.com/psycheawakens",
                    "https://www.twitch.tv/cultofpsyche",
                    "https://kick.com/psycheawakenstarot",
                    "https://psycheawakens.etsy.com"
                ],
                ...data
            };

        case "WebSite":
            return {
                ...baseStructuredData,
                name: "Cult of Psyche",
                url: baseUrl,
                potentialAction: {
                    "@type": "SearchAction",
                    target: `${baseUrl}/search?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                },
                ...data
            };

        case "Article":
            return {
                ...baseStructuredData,
                headline: data.headline,
                description: data.description,
                image: data.image,
                datePublished: data.datePublished,
                dateModified: data.dateModified || data.datePublished,
                author: {
                    "@type": "Person",
                    name: data.author || "Cult of Psyche"
                },
                publisher: {
                    "@type": "Organization",
                    name: "Cult of Psyche",
                    logo: {
                        "@type": "ImageObject",
                        url: `${baseUrl}/logo.png`
                    }
                },
                ...data
            };

        case "Person":
            return {
                ...baseStructuredData,
                name: data.name,
                url: data.url,
                image: data.image,
                jobTitle: data.jobTitle,
                ...data
            };

        default:
            return baseStructuredData;
    }
}
