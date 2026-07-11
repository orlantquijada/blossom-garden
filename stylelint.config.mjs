import config from "ultracite/stylelint";

export default {
  ...config,
  rules: {
    ...config.rules,
    "import-notation": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "apply",
          "config",
          "custom-variant",
          "layer",
          "plugin",
          "screen",
          "source",
          "tailwind",
          "theme",
          "utility",
          "variant",
        ],
      },
    ],
  },
};
