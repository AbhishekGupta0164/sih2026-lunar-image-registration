import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Free, local dev server only. No paid hosting required — see README §10.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
