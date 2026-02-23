import type { LinkRecord } from "./db";

/**
 * Deterministic stable id from link URL template (base64url of first 10 bytes of SHA-256).
 * Same link string => same stable_id everywhere.
 */
export async function toStableId(linkUrl: string): Promise<string> {
  const data = new TextEncoder().encode(linkUrl);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hash).slice(0, 10);
  return base64url(bytes);
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Stable id for a link: stored value or computed from link URL.
 */
export async function getStableId(link: LinkRecord): Promise<string> {
  if (link.stable_id) return link.stable_id;
  return toStableId(link.link);
}
