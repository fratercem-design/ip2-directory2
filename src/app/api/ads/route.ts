import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    const db = await createSupabaseServerClient();
    
    const { searchParams } = new URL(req.url);
    const position = searchParams.get("position");
    const page_path = searchParams.get("page_path") || "/";

    try {
        const now = new Date().toISOString().split("T")[0];

        let query = db
            .from("banner_ads")
            .select(`
                *,
                ad_campaigns!inner(is_active, start_date, end_date)
            `)
            .eq("is_active", true)
            .eq("ad_campaigns.is_active", true)
            .order("priority", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(10);

        // Filter by position
        if (position) {
            query = query.eq("position", position);
        }

        // Filter by date range
        query = query.or(`start_date.is.null,start_date.lte.${now}`);
        query = query.or(`end_date.is.null,end_date.gte.${now}`);

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Filter ads by page targeting
        const filteredAds = (data || []).filter((ad: any) => {
            // Check if ad has page targeting
            if (ad.target_pages && ad.target_pages.length > 0) {
                const matches = ad.target_pages.some((target: string) => {
                    if (target === "*") return true; // Match all
                    if (target.endsWith("*")) {
                        // Prefix match
                        const prefix = target.slice(0, -1);
                        return page_path.startsWith(prefix);
                    }
                    return page_path === target;
                });
                if (!matches) return false;
            }

            // Check excluded pages
            if (ad.exclude_pages && ad.exclude_pages.length > 0) {
                const excluded = ad.exclude_pages.some((exclude: string) => {
                    if (exclude.endsWith("*")) {
                        const prefix = exclude.slice(0, -1);
                        return page_path.startsWith(prefix);
                    }
                    return page_path === exclude;
                });
                if (excluded) return false;
            }

            // Check impression/click limits
            if (ad.max_impressions && ad.current_impressions >= ad.max_impressions) {
                return false;
            }
            if (ad.max_clicks && ad.current_clicks >= ad.max_clicks) {
                return false;
            }

            return true;
        });

        // Return random ad from filtered results (or first if only one)
        const selectedAd = filteredAds.length > 0
            ? filteredAds[Math.floor(Math.random() * filteredAds.length)]
            : null;

        return NextResponse.json({
            ad: selectedAd,
            available: filteredAds.length
        });

    } catch (e) {
        const error = e instanceof Error ? e.message : "Failed to fetch ads";
        return NextResponse.json({ error }, { status: 500 });
    }
}
