// import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      pwaAssets: {
        disabled: true,
        config: true,
      },

      manifest: {
        name: "Specter",
        short_name: "Specter",
        description: "Experience freedom without sacrificing privacy",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        icons: [
          {
            src: "/logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,svg,png,ico,jsx,tsx,ts}"],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 8,
        clientsClaim: true,
        skipWaiting: true,
      },

      devOptions: {
        enabled: false,
        suppressWarnings: true,
        type: "module",
      },
    }),
    // sentryVitePlugin({
    //   org: "sentry",
    //   project: "propagator-frontend",
    //   url: "https://services.api.climatechange.gay/",
    // }),
  ],

  server: {
    https: {
      key: fs.readFileSync('./security/localhost+3-key.pem'),
      cert: fs.readFileSync('./security/localhost+3.pem'),
    },
    port: 3000,
  },

  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      {
        find: "simple-peer",
        replacement: "simple-peer/simplepeer.min.js",
      },
    ],
  },

  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@tabler/icons-react')) {
            return 'tabler-icons';
          }
        },
      },
    },
  },
});
