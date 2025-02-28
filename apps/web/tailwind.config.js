import { tailwindConfig } from "@onepiece-chat/config";

/** @type {import('tailwindcss').Config} */
export default {
  ...tailwindConfig,
  content: [
    ...(Array.isArray(tailwindConfig.content) ? tailwindConfig.content : []),
    "./src/**/*.{ts,tsx}",
  ],
};
