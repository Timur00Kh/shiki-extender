import { Router, Request, Response } from "express";
import { and, desc, eq, like, sql } from "drizzle-orm";
import path from "path";
import { db, altwatcherLink } from "../db/index.js";

const router = Router();

router.get("/link", (req: Request, res: Response) => {
  res.set("Access-Control-Allow-Origin", "*");
  try {
    const title = String(req.query.title ?? "").trim();
    const manga = Number(req.query.manga) || 0;
    const anime = Number(req.query.anime) || 0;
    const ranobe = Number(req.query.ranobe) || 0;
    const approved = req.query.approved === "true";

    const titleCond = title
      ? sql`lower(${altwatcherLink.title}) LIKE ${
          "%" + title.toLowerCase() + "%"
        }`
      : undefined;

    const conditions = [
      titleCond,
      manga ? sql`(${altwatcherLink.manga} & ${manga}) = ${manga}` : undefined,
      anime ? sql`(${altwatcherLink.anime} & ${anime}) = ${anime}` : undefined,
      ranobe
        ? sql`(${altwatcherLink.ranobe} & ${ranobe}) = ${ranobe}`
        : undefined,
    ].filter(Boolean);

    if (approved) {
      conditions.push(eq(altwatcherLink.approved, true));
    }

    const links = db
      .select()
      .from(altwatcherLink)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(altwatcherLink.number_of_downloads))
      .all();

    res.json(links);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post("/link", (req: Request, res: Response) => {
  res.set("Access-Control-Allow-Origin", "*");
  try {
    const {
      title,
      link,
      description,
      manga = 0,
      anime = 0,
      ranobe = 0,
    } = req.body ?? {};

    if (!title) {
      res.status(400).json({ error: "title is not present" });
      return;
    }
    if (!link) {
      res.status(400).json({ error: "link is not present" });
      return;
    }

    const result = db
      .insert(altwatcherLink)
      .values({
        title: String(title),
        link: String(link),
        description: description != null ? String(description) : null,
        manga: Number(manga) || 0,
        anime: Number(anime) || 0,
        ranobe: Number(ranobe) || 0,
      })
      .returning({ id: altwatcherLink.id })
      .get();

    res.json({ id: result.id });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get(
  "/link/:linkId/inc-num-of-downloads",
  (req: Request, res: Response) => {
    res.set("Access-Control-Allow-Origin", "*");
    try {
      const linkId = Number(req.params.linkId);
      if (!Number.isInteger(linkId)) {
        res.sendStatus(400);
        return;
      }
      db.update(altwatcherLink)
        .set({
          number_of_downloads: sql`${altwatcherLink.number_of_downloads} + 1`,
        })
        .where(eq(altwatcherLink.id, linkId))
        .run();
      res.sendStatus(200);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
);

router.get("/defaultLinks", (_req: Request, res: Response) => {
  res.set("Access-Control-Allow-Origin", "*");
  try {
    const rows = db
      .select()
      .from(altwatcherLink)
      .where(eq(altwatcherLink.is_default, true))
      .all();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

const FAQ_PATH = process.env.FAQ_PATH || path.join(process.cwd(), "faq.md");

router.get("/faq", (_req: Request, res: Response) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.sendFile(FAQ_PATH, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("FAQ not found");
    }
  });
});

export default router;
