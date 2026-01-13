import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cultofpsyche.com";
    const currentDate = new Date();

    const staticPages = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority: 1.0
        },
        {
            url: `${baseUrl}/about`,
            lastModified: currentDate,
            changeFrequency: "monthly" as const,
            priority: 0.9
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority: 0.9
        },
        {
            url: `${baseUrl}/services`,
            lastModified: currentDate,
            changeFrequency: "weekly" as const,
            priority: 0.8
        },
        {
            url: `${baseUrl}/texts`,
            lastModified: currentDate,
            changeFrequency: "monthly" as const,
            priority: 0.8
        },
        {
            url: `${baseUrl}/glossary`,
            lastModified: currentDate,
            changeFrequency: "weekly" as const,
            priority: 0.8
        },
        {
            url: `${baseUrl}/divination`,
            lastModified: currentDate,
            changeFrequency: "weekly" as const,
            priority: 0.8
        },
        {
            url: `${baseUrl}/board`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority: 0.7
        },
        {
            url: `${baseUrl}/members`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority: 0.7
        },
        {
            url: `${baseUrl}/testimonials`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority: 0.7
        },
        {
            url: `${baseUrl}/recommendations`,
            lastModified: currentDate,
            changeFrequency: "weekly" as const,
            priority: 0.6
        },
        {
            url: `${baseUrl}/tokens/leaderboard`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority: 0.6
        },
        {
            url: `${baseUrl}/blog/horoscopes`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority: 0.8
        }
    ];

    // Note: Dynamic pages (blog posts, testimonials, members, etc.) would be added here
    // by fetching from the database. For now, we include static pages.

    return staticPages;
}
