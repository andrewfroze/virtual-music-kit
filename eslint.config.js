import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["dist/", "node_modules/"],
  },

  {
    files: ["src/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  js.configs.recommended,
];
