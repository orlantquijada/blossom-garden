import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import {
  ConvexBetterAuthProvider,
  type AuthClient,
} from "@convex-dev/better-auth/react";

import { authClient } from "./lib/auth-client";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;

  if (!convexUrl) {
    console.warn(
      "Missing VITE_CONVEX_URL. Run `pnpm convex:dev` to link Convex."
    );
  }

  // expectAuth pauses the websocket until a JWT arrives, which deadlocks the
  // public pages (/signup, /m/*) for anonymous visitors. Auth still attaches
  // after sign-in; the socket just starts unauthenticated.
  const convexQueryClient = new ConvexQueryClient(convexUrl ?? "");
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: convexQueryClient.queryFn(),
        queryKeyHashFn: convexQueryClient.hashFn(),
      },
    },
  });

  convexQueryClient.connect(queryClient);

  const router = createTanStackRouter({
    Wrap: ({ children }) => (
      <ConvexBetterAuthProvider
        authClient={authClient as unknown as AuthClient}
        client={convexQueryClient.convexClient}
      >
        {children}
      </ConvexBetterAuthProvider>
    ),
    context: { queryClient },
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    routeTree,
    scrollRestoration: true,
  });

  setupRouterSsrQueryIntegration({ queryClient, router });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
