import { NextResponse } from "next/server";
import { readCatalog, addItem, removeItem } from "../../../lib/catalogStore";

// ------------------------------------------------------------
//  /api/catalog — the self-serve art overlay.
//
//  GET     — public. Gallery & Shop merge this over the curated
//            set in lib/data.js, so Tersoo's postings flow into
//            the works wall and the shop shelf without any code.
//  POST    — ADMIN_KEY required. Tersoo posts from /admin:
//            an artwork to the works section, or a product /
//            1/1 original to the shop. Images ride inside the
//            ledger as data URLs (client-side downscaled).
//  DELETE  — ADMIN_KEY required. Un-post anything by id.
// ------------------------------------------------------------

export const dynamic = "force-dynamic";

const KINDS = { artwork: "artworks", product: "products", original: "originals" };
const MAX_BODY = 3_000_000; // postings live inside the ledger — keep them light

function deny(code, error) {
  return NextResponse.json({ error }, { status: code });
}

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isImg = (v) =>
  typeof v === "string" &&
  (/^data:image\/(png|jpe?g|webp|gif);base64,/.test(v) || /^https?:\/\//i.test(v) || v.startsWith("/"));

function sanitize(item, kind) {
  if (!item || typeof item !== "object") return { error: "Missing item." };

  const img = typeof item.img === "string" ? item.img.trim() : "";
  if (!isImg(img)) return { error: "Upload an image of the piece first (or give an image URL)." };
  if (img.length > MAX_BODY) return { error: "That image is too heavy for the ledger — keep it under ~2MB." };

  if (kind === "artwork") {
    const title = str(item.title, 120);
    if (!title) return { error: "The work needs a title." };
    const link = str(item.link, 400);
    if (link && !/^https?:\/\//i.test(link)) return { error: "The link must start with http(s)://" };
    const tags = Array.isArray(item.tags)
      ? item.tags.map((t) => str(t, 40)).filter(Boolean).slice(0, 6)
      : [];
    return {
      item: {
        title,
        img,
        kind: str(item.kind, 80) || "New Work",
        year: str(item.year, 12) || String(new Date().getFullYear()),
        story: str(item.story, 2000),
        tags,
        link: link || null,
        linkLabel: str(item.linkLabel, 60) || null,
      },
    };
  }

  // products + 1/1 originals share the shop shape
  const name = str(item.name, 120);
  if (!name) return { error: "The piece needs a name." };
  const price = Number(item.price);
  if (!Number.isInteger(price) || price <= 0 || price > 2_000_000_000)
    return { error: "Price must be a positive amount in kobo (naira × 100)." };
  const stock = Number(item.stock);
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be 0 or more." };

  if (kind === "original") {
    return {
      item: {
        name,
        price,
        stock,
        img,
        editions: str(item.editions, 40) || "1 ÒF 1",
        collection: "ORIGINALS",
        accent: str(item.accent, 16) || "#9e2b25",
        medium: str(item.medium, 80) || "ORÌGÌNAL WÒRK",
        blurb: str(item.blurb, 500) || null,
      },
    };
  }

  const collection = ["TEES", "PRINTS", "OBJECTS"].includes(item.collection) ? item.collection : null;
  if (!collection) return { error: "Collection must be TEES, PRINTS or OBJECTS." };
  const sizes = Array.isArray(item.sizes)
    ? item.sizes.map((s) => str(s, 12)).filter(Boolean).slice(0, 6)
    : [];
  return {
    item: {
      name,
      price,
      stock,
      img,
      editions: str(item.editions, 40) || "LÌMÌTED",
      collection,
      sizes: sizes.length ? sizes : null,
      colorway: str(item.colorway, 60) || null,
      accent: str(item.accent, 16) || "#9e2b25",
      blurb: str(item.blurb, 500) || null,
    },
  };
}

export async function GET() {
  return NextResponse.json(await readCatalog());
}

export async function POST(req) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return deny(503, "ADMIN_KEY is not set on this server.");
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== expected) return deny(401, "Wrong key.");

  const raw = await req.text();
  if (raw.length > MAX_BODY) return deny(413, "Posting too heavy — keep images under ~2MB.");
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return deny(400, "Malformed JSON.");
  }

  const kind = KINDS[body.kind];
  if (!kind) return deny(400, "kind must be artwork, product or original.");

  const clean = sanitize(body.item, body.kind);
  if (clean.error) return deny(400, clean.error);

  const saved = await addItem(kind, clean.item);
  return NextResponse.json({ ok: true, saved });
}

export async function DELETE(req) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return deny(503, "ADMIN_KEY is not set on this server.");
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== expected) return deny(401, "Wrong key.");

  const kind = KINDS[searchParams.get("kind")];
  const id = searchParams.get("id");
  if (!kind || !id) return deny(400, "kind and id are required.");

  await removeItem(kind, id);
  return NextResponse.json({ ok: true });
}
