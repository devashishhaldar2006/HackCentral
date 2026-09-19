import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7777",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:7777",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
