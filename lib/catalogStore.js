// ------------------------------------------------------------
//  The posted-art overlay — art the artist posts himself
//  from /admin. Same architecture as the order ledger:
//
//  Local / Node host:  writes land in /data/catalog.json.
//  Serverless (Vercel): FS read-only → postings live in
//  instance memory. Connect a DB when permanence matters.
// ------------------------------------------------------------

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const FILE = path.join(process.cwd(), "data", "catalog.json");

const mem = { catalog: null };

const EMPTY = { artworks: [], products: [], originals: [] };

async function readFileOrNull(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

export async function readCatalog() {
  const fromDisk = await readFileOrNull(FILE);
  if (fromDisk) return fromDisk;
  if (mem.catalog) return mem.catalog;
  return EMPTY;
}

async function writeCatalog(cat) {
  try {
    await fs.writeFile(FILE, JSON.stringify(cat, null, 2), "utf8");
  } catch {
    // read-only FS → keep it in instance memory
  }
  mem.catalog = cat;
  return cat;
}

export function newId() {
  return crypto.randomBytes(4).toString("hex");
}

// prepend: the newest posting leads the wall / the shelf
export async function addItem(kind, item) {
  const cat = { ...EMPTY, ...(await readCatalog()) };
  const listed = {
    ...item,
    id: item.id || newId(),
    posted: new Date().toISOString(),
  };
  cat[kind] = [listed, ...(cat[kind] || [])];
  await writeCatalog(cat);
  return listed;
}

export async function removeItem(kind, id) {
  const cat = { ...EMPTY, ...(await readCatalog()) };
  cat[kind] = (cat[kind] || []).filter((x) => x.id !== id);
  await writeCatalog(cat);
  return cat[kind].length;
}
