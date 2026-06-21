//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "import/no-cycle": "off",
      "import/order": "off",
      "pnpm/json-enforce-catalog": "off",
      "sort-imports": "off",
    },
  },
  {
    ignores: ["eslint.config.js", "prettier.config.js"],
  },
];
