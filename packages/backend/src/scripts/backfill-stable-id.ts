/**
 * One-off backfill: set stable_id for all rows where it is null.
 * Run after migrations: pnpm run db:migrate && pnpm run db:backfill-stable-id
 */
import { db, altwatcherLink } from "../db/index.js";
import { toStableId } from "../utils/stableId.js";
import { eq, isNull } from "drizzle-orm";

const rows = db
  .select({ id: altwatcherLink.id, link: altwatcherLink.link })
  .from(altwatcherLink)
  .where(isNull(altwatcherLink.stable_id))
  .all();

for (const row of rows) {
  const stableId = toStableId(row.link);
  db.update(altwatcherLink)
    .set({ stable_id: stableId })
    .where(eq(altwatcherLink.id, row.id))
    .run();
}

console.log(`Backfilled stable_id for ${rows.length} rows.`);
