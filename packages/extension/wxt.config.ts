import path from "node:path";
import { defineConfig } from "wxt";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  srcDir: ".",
  vite: () => ({
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname),
      },
    },
  }),
  manifest: {
    name: "Shiki extender",
    description:
      "AltWatcher: quick links to alternative anime/manga/ranobe sites on Shikimori.",
    version: "1.0.2",
    permissions: ["storage", "unlimitedStorage"],
    action: {
      default_title: "Shiki extender",
      default_popup: "options.html?popup=true",
    },
    options_ui: {
      page: "options.html",
    },
  },
});
