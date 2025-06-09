import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "update-build.js",
      "serviceWorker.ts",
      "node_modules/",
      "dist/",
      "env.d.ts",
      "eslint.config.js",
      "postcss.config.js",
      "prettier.config.js",
      "tailwind.config.js",
      "vite.config.ts",
      "public/sw.js"
    ],
    files: ["**/*.{ts,tsx,js,jsx}"],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      sourceType: "module",
      globals: globals.browser,
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.app.json",
        tsconfigRootDir: process.cwd(),
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.app.json",
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "@typescript-eslint": typescriptPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "no-unused-vars": ["warn", { varsIgnorePattern: "^React$" }],
      "no-unused-vars": ["warn", { varsIgnorePattern: "^React$" }],
      "prettier/prettier": 0,
      "import/no-named-as-default": "off",
      "import/no-default-export": "off",
      "import/no-anonymous-default-export": "off",
    }
  },
];