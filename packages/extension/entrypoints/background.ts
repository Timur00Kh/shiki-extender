import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";
import { getAllLinks, getLink, putLink, putLinks } from "../utils/db";
import type { LinkRecord } from "../utils/db";
import { DEFAULT_LINKS } from "../utils/defaultLinks";
import { apiBaseUrl, hasApi } from "../utils/api";

type ApiLink = {
  id: number;
  title: string;
  link: string;
  description?: string | null;
  manga: number;
  anime: number;
  ranobe: number;
  approved: boolean;
  number_of_downloads: number;
  is_default?: boolean;
  stable_id?: string | null;
};

function apiRowToLink(row: ApiLink): LinkRecord {
  return {
    id: row.id,
    stable_id: row.stable_id ?? undefined,
    title: row.title,
    link: row.link,
    description: row.description ?? undefined,
    tags: { manga: row.manga, anime: row.anime, ranobe: row.ranobe },
    approved: row.approved,
    number_of_downloads: row.number_of_downloads,
  };
}

async function fetchApiLinks(params: {
  title?: string;
  manga?: number;
  anime?: number;
  ranobe?: number;
  approved?: boolean;
}): Promise<LinkRecord[]> {
  if (!apiBaseUrl) return [];
  const q = new URLSearchParams();
  if (params.title != null) q.set("title", params.title);
  if (params.manga != null) q.set("manga", String(params.manga));
  if (params.anime != null) q.set("anime", String(params.anime));
  if (params.ranobe != null) q.set("ranobe", String(params.ranobe));
  if (params.approved != null) q.set("approved", String(params.approved));
  const url = `${apiBaseUrl}/altWatcher/link?${q.toString()}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const rows: ApiLink[] = await res.json();
  return rows.map(apiRowToLink);
}

async function fetchDefaultLinks(): Promise<LinkRecord[]> {
  if (!apiBaseUrl) return [];
  const res = await fetch(`${apiBaseUrl}/altWatcher/defaultLinks`);
  if (!res.ok) return [];
  const rows: ApiLink[] = await res.json();
  return rows.map(apiRowToLink);
}

function mergeLinks(
  apiLinks: LinkRecord[],
  localLinks: LinkRecord[]
): LinkRecord[] {
  const byLink = new Map<string, LinkRecord>();
  for (const l of apiLinks) {
    byLink.set(l.link, l);
  }
  for (const l of localLinks) {
    if (!byLink.has(l.link)) {
      byLink.set(l.link, l);
    }
  }
  return Array.from(byLink.values());
}

export default defineBackground({
  main() {
    browser.runtime.onMessage.addListener(
      (
        req: {
          do: string;
          hash_id?: number;
          id?: number;
          title?: string;
          manga?: number;
          anime?: number;
          ranobe?: number;
          approved?: boolean;
        },
        _sender: unknown,
        sendResponse: (response?: unknown) => void
      ) => {
        if (req.do === "getAltWatcherLinksLocal") {
          getAllLinks()
            .then((results) => sendResponse(results))
            .catch((err) => {
              console.error(err);
              sendResponse([]);
            });
          return true;
        }
        if (req.do === "getAltWatcherLinks") {
          (async () => {
            try {
              if (hasApi()) {
                const apiLinks = await fetchApiLinks({
                  title: req.title,
                  manga: req.manga,
                  anime: req.anime,
                  ranobe: req.ranobe,
                  approved: req.approved,
                });
                const localLinks = await getAllLinks();
                return sendResponse(mergeLinks(apiLinks, localLinks));
              }
              const results = await getAllLinks();
              sendResponse(results);
            } catch (err) {
              console.error(err);
              const fallback = await getAllLinks().catch(() => []);
              sendResponse(fallback);
            }
          })();
          return true;
        }
        if (req.do === "altWatcherIsEnabled") {
          browser.storage.local
            .get("altWatcher")
            .then((result) => sendResponse(result.altWatcher ?? true));
          return true;
        }
        if (req.do === "altWatcherLinkUsed") {
          if (req.id != null && hasApi() && apiBaseUrl) {
            fetch(
              `${apiBaseUrl}/altWatcher/link/${req.id}/inc-num-of-downloads`
            ).catch(console.error);
          }
          if (req.hash_id != null) {
            getLink(req.hash_id)
              .then((link) => {
                if (!link) return;
                link.used = (link.used ?? 0) + 1;
                return putLink(link);
              })
              .catch(console.error);
          }
          sendResponse(undefined);
          return false;
        }
        return false;
      }
    );

    browser.runtime.onInstalled.addListener(async () => {
      const results = await getAllLinks();
      if (results.length > 0) return;

      if (hasApi()) {
        try {
          const defaultLinks = await fetchDefaultLinks();
          if (defaultLinks.length > 0) {
            await putLinks(defaultLinks);
            return;
          }
        } catch (_) {
          // fallback to built-in defaults
        }
      }
      await putLinks(DEFAULT_LINKS);
    });
  },
});
