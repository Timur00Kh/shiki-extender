import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "linksDb";
const DB_VERSION = 1;
const STORE_NAME = "link";

export interface LinkRecord {
  hash_id?: number;
  id?: number;
  stable_id?: string;
  title: string;
  link: string;
  tags: { manga: number; anime: number; ranobe: number };
  approved?: boolean;
  number_of_downloads?: number;
  description?: string;
  used?: number;
  favicon?: string;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

/** Plain object for IndexedDB (Vue reactive Proxy is not structured-cloneable). */
function toPlainLink(link: LinkRecord): LinkRecord {
  return JSON.parse(JSON.stringify(link));
}

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, {
            keyPath: "hash_id",
            autoIncrement: true,
          });
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllLinks(): Promise<LinkRecord[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function getLink(hashId: number): Promise<LinkRecord | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, hashId);
}

export async function putLink(link: LinkRecord): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, toPlainLink(link));
}

export async function putLinks(links: LinkRecord[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  for (const link of links) {
    await tx.store.put(toPlainLink(link));
  }
  await tx.done;
}

export async function deleteLink(hashId: number): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, hashId);
}

export async function clearLinks(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
