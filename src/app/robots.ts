import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cultofpsyche.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/api/",
                    "/me/",
                    "/secret/",
                    "/_next/",
                    "/private/"
                ]
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`
    };
}
