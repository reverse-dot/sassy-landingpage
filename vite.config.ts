import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves the site under /sassy-landingpage/; everywhere else (Vercel, local) it lives at the root.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/sassy-landingpage/" : "/",
  plugins: [react()],
});
