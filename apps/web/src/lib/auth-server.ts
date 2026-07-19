import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";

const convexSiteUrl: unknown = import.meta.env.VITE_CONVEX_SITE_URL;
const convexUrl: unknown = import.meta.env.VITE_CONVEX_URL;

if (typeof convexSiteUrl !== "string" || typeof convexUrl !== "string") {
  throw new TypeError("VITE_CONVEX_SITE_URL and VITE_CONVEX_URL are required.");
}

export const { fetchAuthQuery, getToken, handler } = convexBetterAuthReactStart(
  {
    convexSiteUrl,
    convexUrl,
  }
);
