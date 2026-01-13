
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { pollPlatformAccounts } from "@/inngest/functions/poll";
import { generateDailyContent } from "@/inngest/functions/generate-daily-content";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [pollPlatformAccounts, generateDailyContent],
});
