import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  {
    ignores: ["dist", "node_modules"],
  },

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },

    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "unused-imports": unusedImports,
    },

    rules: {
      /* ❌ TURN OFF base rule */
      "no-unused-vars": "off",

      /* ✅ USE TS-AWARE UNUSED CHECK */
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      /* ✅ REMOVE UNUSED IMPORTS COMPLETELY */
      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "warn",
    },

    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
