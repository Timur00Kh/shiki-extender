import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";
import { createApp } from "vue";
import AltWatcherApp from "./altwatcher/AltWatcherApp.vue";

const SHIKIMORI_PATHS = ["/animes/", "/mangas/", "/ranobe/"];

function isTitlePage(): boolean {
  const path = window.location.pathname;
  return SHIKIMORI_PATHS.some((p) => path.includes(p));
}

export default defineContentScript({
  matches: [
    "*://shikimori.one/*",
    "*://shikimori.org/*",
    "*://shikimori.io/*",
    "*://shiki.one/*",
  ],
  runAt: "document_end",

  async main(ctx) {
    if (!isTitlePage()) return;

    const enabled = await new Promise<boolean>((resolve) => {
      browser.runtime.sendMessage(
        { do: "altWatcherIsEnabled" },
        (res: unknown) => {
          resolve(res !== false && res !== "false");
        }
      );
    });
    if (!enabled) return;

    function mountUi() {
      const existing = document.getElementById("altWatcherContainer");
      if (existing) existing.remove();

      const right = document.querySelector(".c-info-right");
      if (!right) return;

      const wrap = document.createElement("div");
      wrap.id = "altWatcher";
      right.appendChild(wrap);

      const app = createApp(AltWatcherApp);
      app.mount(wrap);
    }

    function tryMount() {
      if (document.querySelector(".c-info-right")) {
        mountUi();
      }
    }

    tryMount();

    ctx.addEventListener(document, "DOMContentLoaded", tryMount);
    ctx.addEventListener(document, "page:load", tryMount);
    ctx.addEventListener(document, "turbolinks:load", tryMount);
  },
});
