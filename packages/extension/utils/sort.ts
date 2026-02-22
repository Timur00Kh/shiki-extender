import type { LinkRecord } from "./db";

export function sortByUsedTimes(a: LinkRecord, b: LinkRecord): number {
  return (b.used ?? 0) - (a.used ?? 0);
}
