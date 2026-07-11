import tsParser from "@typescript-eslint/parser";
import query from "@tanstack/eslint-plugin-query";
import router from "@tanstack/eslint-plugin-router";
import start from "@tanstack/eslint-plugin-start";
import reactPlugin from "eslint-plugin-react";
import core from "ultracite/eslint/core";
import react from "ultracite/eslint/react";

const webFiles = ["apps/web/src/**/*.{ts,tsx}"];

export default [
  ...core,
  ...react,
  {
    settings: {
      react: {
        version: "19.0",
      },
    },
    plugins: {
      react: reactPlugin,
    },
    rules: {
      "func-style": "off",
      "react/prop-types": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function",
        },
      ],
      "react-doctor/only-export-components": "off",
      "react-hooks/todo": "off",
    },
  },
  {
    files: webFiles,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./apps/web/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...query.configs["flat/recommended"].map((config) => ({
    ...config,
    files: webFiles,
  })),
  ...router.configs["flat/recommended"].map((config) => ({
    ...config,
    files: webFiles,
  })),
  ...start.configs["flat/recommended"].map((config) => ({
    ...config,
    files: webFiles,
  })),
  {
    files: ["apps/web/src/routes/api/**/*.ts"],
    rules: {
      "github/filenames-match-regex": "off",
      "sonarjs/function-name": "off",
    },
  },
  {
    files: ["apps/web/src/lib/utils.ts"],
    rules: {
      "unicorn/name-replacements": "off",
    },
  },
];
