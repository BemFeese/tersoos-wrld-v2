import { NextResponse } from "next/server";
import { readOrders, readCommissions, readSubscribers } from "../../../lib/orderStore";
import { readCatalog } from "../../../lib/catalogStore";

// ------------------------------------------------------------
//  GET /api/admin?key=ADMIN_KEY
//  The artist's back office: his postings catalog, customer
//  orders, commissions, subscribers. Set ADMIN_KEY in
//  .env.local. Anything else → 401.
// ------------------------------------------------------------

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const expected = process.env.ADMIN_KEY;

  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_KEY is not set on this server. Add ADMIN_KEY=… to .env.local and restart." },
      { status: 503 }
    );
  }
  if (searchParams.get("key") !== expected) {
    return NextResponse.json({ error: "Wrong key." }, { status: 401 });
  }

  const [orders, commissions, subscribers, catalog] = await Promise.all([
    readOrders(),
    readCommissions(),
    readSubscribers(),
    readCatalog(),
  ]);

  return NextResponse.json({ ok: true, orders, commissions, subscribers, catalog });
}
