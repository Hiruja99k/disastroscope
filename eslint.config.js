import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "capacitor.config.ts",
      "backend/**/*",
      "**/venv/**/*",
      "**/.venv/**/*",
      "tailwind.config.ts",
      "vite.config.ts",
      "postcss.config.js",
      "jest.config.js",
      "eslint.config.js"
    ]
  },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        React: "readonly",
        JSX: "readonly"
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
      // Basic enterprise rules - warnings only to not break build
      "prefer-const": "warn",
      "no-var": "warn",
      "eqeqeq": ["warn", "always"],
      "curly": ["warn", "all"],
      // Disable problematic rules for TypeScript
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  }
];
