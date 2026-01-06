
import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { pollPlatformAccounts } from "@/inngest/functions/poll";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [pollPlatformAccounts],
});
