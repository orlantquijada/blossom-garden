import tailwindcss from "@tailwindcss/vite";
import { createEnv } from "@t3-oss/env-core";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import * as z from "zod";

const config = defineConfig(({ mode }) => {
  const runtimeEnv = loadEnv(mode, process.cwd(), "");

  createEnv({
    clientPrefix: "VITE_",
    client: {
      VITE_CONVEX_SITE_URL: z.url(),
      VITE_CONVEX_URL: z.url(),
    },
    emptyStringAsUndefined: true,
    runtimeEnvStrict: {
      VITE_CONVEX_SITE_URL: runtimeEnv.VITE_CONVEX_SITE_URL,
      VITE_CONVEX_URL: runtimeEnv.VITE_CONVEX_URL,
    },
  });

  return {
    ssr: {
      noExternal: ["@convex-dev/better-auth"],
    },
    plugins: [
      devtools(),
      nitro({ rollupConfig: { external: [/^@sentry\//u] } }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],
    resolve: { tsconfigPaths: true },
  };
});

export default config;
