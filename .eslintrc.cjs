/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["plugin:@typescript-eslint/recommended"],
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.cjs",
    "**/*.config.mjs",
    "**/*.config.ts",
    "**/*.config.tsx",
    "node_modules",
    "dist",
    ".next",
    ".turbo",
  ],
};

module.exports = config;