import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { 
    ignores: [
      "dist", 
      "capacitor.config.ts",
      "backend/**/*",
      "**/node_modules/**/*",
      "**/venv/**/*",
      "**/.venv/**/*",
      "tailwind.config.ts",
      "vite.config.ts"
    ] 
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        __dirname: "readonly",
        process: "readonly"
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Basic enterprise rules that won't break existing code
      "prefer-const": "warn",
      "no-var": "warn",
      "eqeqeq": ["warn", "always"],
      "curly": ["warn", "all"],
      // Disable TypeScript-specific rules for now
      "no-undef": "off",
    },
  }
];
