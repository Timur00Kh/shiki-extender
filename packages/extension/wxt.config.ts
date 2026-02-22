import path from "node:path";
import { defineConfig } from "wxt";
import vue from "@vitejs/plugin-vue";
import pkg from "./package.json" with { type: "json" };

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
    version: pkg.version,
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
