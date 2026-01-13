import { inngest } from "../client";

export const generateDailyContent = inngest.createFunction(
    { id: "generate-daily-content" },
    { cron: "0 6 * * *" }, // Run daily at 6 AM
    async ({ step }) => {
        const adminSecret = process.env.ADMIN_SECRET;
        if (!adminSecret) {
            console.error("ADMIN_SECRET not configured");
            return;
        }

        // Generate daily article
        await step.run("generate-article", async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/blog/generate`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${adminSecret}`
                    },
                    body: JSON.stringify({
                        type: "article"
                    })
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(`Failed to generate article: ${error}`);
                }

                const data = await response.json();
                console.log("Generated article:", data.post?.id);
                return data;
            } catch (error) {
                console.error("Error generating article:", error);
                throw error;
            }
        });

        // Generate horoscopes for all signs
        const signs = [
            "aries", "taurus", "gemini", "cancer", "leo", "virgo",
            "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
        ];

        const today = new Date().toISOString().split("T")[0];

        await step.run("generate-horoscopes", async () => {
            const results = await Promise.allSettled(
                signs.map(async (sign) => {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/blog/generate`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${adminSecret}`
                            },
                            body: JSON.stringify({
                                type: "horoscope",
                                sign,
                                date: today
                            })
                        });

                        if (!response.ok) {
                            const error = await response.text();
                            throw new Error(`Failed to generate horoscope for ${sign}: ${error}`);
                        }

                        const data = await response.json();
                        return { sign, success: true, data };
                    } catch (error) {
                        console.error(`Error generating horoscope for ${sign}:`, error);
                        return { sign, success: false, error };
                    }
                })
            );

            const successful = results.filter(r => r.status === "fulfilled" && r.value.success).length;
            console.log(`Generated ${successful}/${signs.length} horoscopes`);
            return results;
        });

        return { success: true, date: today };
    }
);
