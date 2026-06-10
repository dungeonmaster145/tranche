import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH lets GitHub Pages serve from a subpath (e.g. /tranche/).
// Vercel, Netlify, Cloudflare, and custom domains serve from root, so
// the default "/" is correct there and you can ignore this entirely.
export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
});
