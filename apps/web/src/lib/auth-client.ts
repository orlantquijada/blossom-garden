import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// ponytail: shared prototype password; replace with email OTP before production.
export const initialMemberCredential = "blossom-garden-member";

export const authClient = createAuthClient({
  plugins: [convexClient()],
});
