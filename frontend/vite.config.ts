import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/user": { target: "http://localhost:80", changeOrigin: true },
      "/catalog": { target: "http://localhost:80", changeOrigin: true },
      "/loan": { target: "http://localhost:80", changeOrigin: true },
      "/notification": { target: "http://localhost:80", changeOrigin: true },
    },
  },
})