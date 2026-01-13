import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface GenerateOptions {
    type: "article" | "horoscope";
    topic?: string;
    sign?: string;
    date?: string;
}

async function generateWithOpenAI(prompt: string, maxTokens = 1000) {
    if (!OPENAI_API_KEY) {
        throw new Error("OpenAI API key not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a writer for the Cult of Psyche, a spiritual community focused on shadow work, transformation, and the integration of light and dark. Write in a mystical, thoughtful, and accessible style. Use metaphors and poetic language when appropriate."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: maxTokens,
            temperature: 0.8
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function generateWithAnthropic(prompt: string, maxTokens = 1000) {
    if (!ANTHROPIC_API_KEY) {
        throw new Error("Anthropic API key not configured");
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: maxTokens,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            system: "You are a writer for the Cult of Psyche, a spiritual community focused on shadow work, transformation, and the integration of light and dark. Write in a mystical, thoughtful, and accessible style. Use metaphors and poetic language when appropriate."
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

export async function POST(req: Request) {
    const db = await createSupabaseServerClient();
    const { data: { user } } = await db.auth.getUser();

    // Check for admin secret
    const authHeader = req.headers.get("authorization");
    const adminSecret = process.env.ADMIN_SECRET;
    
    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { type, topic, sign, date }: GenerateOptions = body;

        let prompt = "";
        let title = "";
        let slug = "";
        let content = "";

        if (type === "article") {
            const topics = topic || [
                "The nature of shadow work",
                "Understanding Rahu and Ketu",
                "The Serpent Path of transformation",
                "Psyche and the journey inward",
                "The First Flame of consciousness",
                "Integrating light and dark",
                "The Twelve Lineages",
                "Memory and forgetting",
                "Desire as direction",
                "The mask and the truth"
            ];
            
            const selectedTopic = Array.isArray(topics) 
                ? topics[Math.floor(Math.random() * topics.length)]
                : topics;

            prompt = `Write a thoughtful article (800-1200 words) about: ${selectedTopic}. 

The article should:
- Be written for the Cult of Psyche community
- Explore the topic with depth and nuance
- Use mystical and poetic language when appropriate
- Be accessible but profound
- Include practical insights
- Connect to themes of transformation, shadow work, and spiritual growth

Format: Title first, then content.`;

            content = await generateWithOpenAI(prompt, 1500);
            
            // Extract title (first line) and content
            const lines = content.split("\n");
            title = lines[0].replace(/^#+\s*/, "").trim() || `Article: ${selectedTopic}`;
            content = lines.slice(1).join("\n").trim() || content;
            slug = title.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

        } else if (type === "horoscope") {
            const signs = [
                "aries", "taurus", "gemini", "cancer", "leo", "virgo",
                "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
            ];
            
            const selectedSign = sign || signs[Math.floor(Math.random() * signs.length)];
            const horoscopeDate = date || new Date().toISOString().split("T")[0];

            prompt = `Write a daily horoscope (150-250 words) for ${selectedSign} for ${horoscopeDate}.

The horoscope should:
- Be written in the style of the Cult of Psyche
- Connect astrological themes to shadow work and transformation
- Be mystical but practical
- Offer guidance for the day
- Reference themes like Rahu (desire), Ketu (release), and the Serpent Path
- Be encouraging and insightful

Format: A brief title, then the horoscope content.`;

            content = await generateWithAnthropic(prompt, 400);
            
            // Extract title and content
            const lines = content.split("\n");
            title = lines[0].replace(/^#+\s*/, "").trim() || `${selectedSign.charAt(0).toUpperCase() + selectedSign.slice(1)} - ${horoscopeDate}`;
            content = lines.slice(1).join("\n").trim() || content;

            // Save horoscope
            const { data: horoscope, error: horoError } = await db
                .from("horoscopes")
                .upsert({
                    date: horoscopeDate,
                    sign: selectedSign,
                    title,
                    content,
                    is_ai_generated: true,
                    ai_model: "claude-3-5-sonnet"
                }, {
                    onConflict: "date,sign"
                })
                .select()
                .single();

            if (horoError) {
                return NextResponse.json({ error: horoError.message }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                horoscope,
                type: "horoscope"
            });
        }

        // Save article
        const { data: post, error: postError } = await db
            .from("blog_posts")
            .insert({
                title,
                slug,
                content,
                excerpt: content.substring(0, 200) + "...",
                post_type: "article",
                category: "philosophy",
                tags: ["ai-generated", "daily"],
                is_published: true,
                is_ai_generated: true,
                ai_model: "gpt-4",
                published_at: new Date().toISOString()
            })
            .select()
            .single();

        if (postError) {
            return NextResponse.json({ error: postError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            post,
            type: "article"
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to generate content";
        console.error("Generation error:", error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
