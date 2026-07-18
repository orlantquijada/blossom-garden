import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";

const convexSiteUrl = process.env.VITE_CONVEX_SITE_URL;
const convexUrl = process.env.VITE_CONVEX_URL;

if (convexSiteUrl === undefined || convexUrl === undefined) {
  throw new Error("VITE_CONVEX_SITE_URL and VITE_CONVEX_URL are required.");
}

export const { fetchAuthQuery, getToken, handler } = convexBetterAuthReactStart(
  {
    convexSiteUrl,
    convexUrl,
  }
);
