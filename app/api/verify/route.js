import { NextResponse } from "next/server";
import { readOrders, updateOrder } from "../../../lib/orderStore";

// ------------------------------------------------------------
//  GET /api/verify?ref=WRLD-XXXX | ?trxref=...
//  Verifies with Paystack (if a secret key exists) and flips the
//  ledger entry to "paid". The /paid page calls this on load.
// ------------------------------------------------------------

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref") || searchParams.get("trxref") || searchParams.get("reference");

  if (!ref) return NextResponse.json({ error: "Missing order reference" }, { status: 400 });

  let order = (await readOrders()).find((o) => o.ref === ref);

  if (!order) return NextResponse.json({ error: "Order not found in the ledger" }, { status: 404 });

  // ask Paystack for the truth before trusting anything
  if (process.env.PAYSTACK_SECRET_KEY && order.status !== "paid") {
    try {
      const res = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref), {
        headers: { Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY },
      });
      const data = await res.json();
      if (data.status && data.data?.status === "success") {
        order = await updateOrder(ref, {
          status: "paid",
          channel: "paystack",
          paidAt: new Date().toISOString(),
          payAmount: data.data.amount,
        });
      } else if (data.status && data.data?.status && data.data.status !== "success") {
        await updateOrder(ref, { paystackStatus: data.data.status });
      }
    } catch {
      // network hiccup — leave status as-is, /paid page will retry on refresh
    }
  }

  return NextResponse.json({
    ok: true,
    ref: order.ref,
    status: order.status,
    total: order.total,
    currency: order.currency,
    lines: order.lines,
    buyer: { name: order.buyer?.name, email: order.buyer?.email },
  });
}
