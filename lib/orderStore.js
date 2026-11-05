// ------------------------------------------------------------
//  The Wrld's ledger — flat-file order store with an in-memory
//  fallback for read-only serverless platforms (Vercel/Netlify).
//
//  Local / Node host:  writes land in /data/*.json, persist forever.
//  Serverless:         FS is read-only → the seeded JSON ships with
//  the bundle and mutations live in instance memory. The demo
//  stays fully interactive either way; move to a real DB when
//  order volume matters.
// ------------------------------------------------------------
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const FILE = path.join(process.cwd(), "data", "orders.json");
const LIST = path.join(process.cwd(), "data", "newsletter.json");
const CM_FILE = path.join(process.cwd(), "data", "commissions.json");

const mem = { orders: null, subscribers: null, commissions: null };

async function readFileOrNull(file) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return null;
  }
}

// ---------- ORDERS ----------
export async function readOrders() {
  const fromDisk = await readFileOrNull(FILE);
  if (fromDisk) return fromDisk;
  if (mem.orders) return mem.orders;
  // absolute last resort: empty ledger
  return [];
}

export async function saveOrder(order) {
  const orders = await readOrders();
  const next = [...orders, order];
  try {
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
  } catch {
    // read-only FS → keep it in instance memory
  }
  mem.orders = next;
  return order;
}

export async function updateOrder(ref, patch) {
  const orders = await readOrders();
  const i = orders.findIndex((o) => o.ref === ref);
  if (i === -1) return null;
  const next = [...orders];
  next[i] = { ...next[i], ...patch };
  try {
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
  } catch {}
  mem.orders = next;
  return next[i];
}

export function newRef() {
  return "WRLD-" + crypto.randomBytes(3).toString("hex").toUpperCase();
}

// payments amount safety: the server re-prices every cart
export function computeTotal(products, items) {
  const lines = [];
  for (const it of items) {
    const p = products.find((x) => x.id === it.id);
    if (!p) throw new Error("Unknown product: " + it.id);
    const qty = Math.max(1, Math.min(20, Number(it.qty) || 1));
    lines.push({ id: p.id, name: p.name, price: p.price, qty, size: it.size || null, colorway: it.colorway || null, amount: p.price * qty });
  }
  return { lines, total: lines.reduce((n, l) => n + l.amount, 0) };
}

// ---------- SUBSCRIBERS ----------
export async function addSubscriber(email) {
  const subs = await readSubscribers();
  const next = subs.includes(email) ? subs : [...subs, email.toLowerCase()];
  try {
    await fs.writeFile(LIST, JSON.stringify(next, null, 2), "utf8");
  } catch {}
  mem.subscribers = next;
  return next.length;
}

export async function readSubscribers() {
  const fromDisk = await readFileOrNull(LIST);
  if (fromDisk) return fromDisk;
  return mem.subscribers || [];
}

// ---------- COMMISSIONS ----------
export async function readCommissions() {
  const fromDisk = await readFileOrNull(CM_FILE);
  if (fromDisk) return fromDisk;
  return mem.commissions || [];
}

export async function saveCommission(c) {
  const all = await readCommissions();
  const next = [...all, c];
  try {
    await fs.writeFile(CM_FILE, JSON.stringify(next, null, 2), "utf8");
  } catch {}
  mem.commissions = next;
  return c;
}
