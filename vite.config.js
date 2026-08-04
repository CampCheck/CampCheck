import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/CampCheck/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "apple-touch-icon.png",
      ],

      manifest: {
        name: "CampCheck",
        short_name: "CampCheck",
        description: "Camping checklist and trip planner",
        theme_color: "#0aa35c",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/CampCheck/",
        scope: "/CampCheck/",

        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});