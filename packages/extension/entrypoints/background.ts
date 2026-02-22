import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";
import { getAllLinks, getLink, putLink, putLinks } from "../utils/db";
import { DEFAULT_LINKS } from "../utils/defaultLinks";

export default defineBackground({
  main() {
    browser.runtime.onMessage.addListener(
      (
        req: { do: string; hash_id?: number },
        _sender: unknown,
        sendResponse: (response?: unknown) => void
      ) => {
        if (req.do === "getAltWatcherLinks") {
          getAllLinks()
            .then((results) => sendResponse(results))
            .catch((err) => {
              console.error(err);
              sendResponse([]);
            });
          return true;
        }
        if (req.do === "altWatcherIsEnabled") {
          browser.storage.local
            .get("altWatcher")
            .then((result) => sendResponse(result.altWatcher ?? true));
          return true;
        }
        if (req.do === "altWatcherLinkUsed" && req.hash_id != null) {
          getLink(req.hash_id)
            .then((link) => {
              if (!link) return;
              link.used = (link.used ?? 0) + 1;
              return putLink(link);
            })
            .catch(console.error);
          sendResponse(undefined);
          return false;
        }
        return false;
      }
    );

    browser.runtime.onInstalled.addListener(async () => {
      const results = await getAllLinks();
      if (results.length > 0) return;

      // TODO: integrate with backend (Convex/Supabase) — fetch defaultLinks from API, then putLinks(data)
      await putLinks(DEFAULT_LINKS);
    });
  },
});
