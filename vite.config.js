import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  server: {
    port: 2727,
  },
  preview: {
    port: 8080,
  },
  build: {
    outDir: "production",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});