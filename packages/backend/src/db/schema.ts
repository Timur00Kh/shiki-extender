import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const altwatcherLink = sqliteTable("altwatcher_link", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  link: text("link").notNull(),
  description: text("description"),
  manga: integer("manga").default(0).notNull(),
  anime: integer("anime").default(0).notNull(),
  ranobe: integer("ranobe").default(0).notNull(),
  approved: integer("approved", { mode: "boolean" }).default(false).notNull(),
  number_of_downloads: integer("number_of_downloads").default(1).notNull(),
  is_default: integer("is_default", { mode: "boolean" })
    .default(false)
    .notNull(),
  stable_id: text("stable_id").unique(),
});

export type AltWatcherLink = typeof altwatcherLink.$inferSelect;
export type NewAltWatcherLink = typeof altwatcherLink.$inferInsert;
