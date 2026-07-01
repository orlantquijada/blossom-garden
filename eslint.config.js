import tsParser from "@typescript-eslint/parser";
import tanstack from "ultracite/eslint/tanstack";

export default [
  {
    files: ["apps/web/src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./apps/web/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tanstack,
  {
    ignores: [
      ".agents/**",
      ".claude/**",
      "apps/web/.output/**",
      "apps/web/.vercel/**",
      "apps/web/convex/_generated/**",
      "apps/web/src/routeTree.gen.ts",
    ],
  },
];
