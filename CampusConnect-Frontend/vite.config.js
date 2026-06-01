import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: '/',
  // base: "/", // Important: Set base path for production
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target:
          "http://campus-connect.ingress.cc.vg-project.shoot.canary.k8s-hana.ondemand.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/graphql": {
        target:
          "http://campus-connect.ingress.cc.vg-project.shoot.canary.k8s-hana.ondemand.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, ""),
      },
    },
  },
});
