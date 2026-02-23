import crypto from "node:crypto";

/**
 * Deterministic stable id from link URL template (base64url of first 10 bytes of SHA-256).
 * Same link string => same stable_id everywhere.
 */
export function toStableId(linkUrl: string): string {
  const hash = crypto.createHash("sha256").update(linkUrl).digest();
  const slice = hash.subarray(0, 10);
  return slice
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
