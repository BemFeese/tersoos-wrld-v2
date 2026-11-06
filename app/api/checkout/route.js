import { NextResponse } from "next/server";
import { products, originals } from "../../../lib/data";
import { saveOrder, updateOrder, computeTotal, newRef } from "../../../lib/orderStore";
import { readCatalog } from "../../../lib/catalogStore";

// ------------------------------------------------------------
//  POST /api/checkout
//  1. Re-prices the cart on the server (client prices are advisory)
//  2. Stamps the order into the ledger
//  3. If PAYSTACK_SECRET_KEY is set → initialize a real transaction
//     and return its payment URL.
//  4. Else use NEXT_PUBLIC_FALLBACK_PAYMENT_LINK, or tell the buyer
//     their order is being confirmed (WhatsApp flow).
// ------------------------------------------------------------

export async function POST(req) {
  try {
    const body = await req.json();
    const buyer = body.buyer || {};
    const items = Array.isArray(body.items) ? body.items : [];

    if (!items.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    if (!buyer.name || !buyer.email || !buyer.phone)
      return NextResponse.json({ error: "Name, email and phone are required." }, { status: 400 });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(buyer.email))
      return NextResponse.json({ error: "That email looks misspelled — even for us." }, { status: 400 });

    // art Tersoo posts from /admin rides in the ledger — the re-pricer
    // trusts it exactly like the curated catalog
    const cat = await readCatalog();
    const { lines, total } = computeTotal(
      [...products, ...originals, ...(cat.products || []), ...(cat.originals || [])],
      items
    );
    const ref = newRef();

    await saveOrder({
      ref,
      createdAt: new Date().toISOString(),
      status: "pending",
      buyer,
      lines,
      total,
      currency: process.env.NEXT_PUBLIC_CURRENCY || "NGN",
    });

    const origin = new URL(req.url).origin;
    const callback_url = origin + "/paid?ref=" + ref;

    // --- real Paystack transaction ---
    if (process.env.PAYSTACK_SECRET_KEY) {
      const res = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.PAYSTACK_SECRET_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: buyer.email,
          amount: total, // kobo
          currency: process.env.NEXT_PUBLIC_CURRENCY || "NGN",
          reference: ref,
          callback_url,
          metadata: {
            custom_fields: [
              { display_name: "Order Ref", variable_name: "order_ref", value: ref },
              { display_name: "Items", variable_name: "items", value: lines.map((l) => `${l.qty}× ${l.name} (${l.size || "-"})`).join("; ") },
            ],
          },
        }),
      });
      const data = await res.json();
      if (data.status && data.data?.authorization_url) {
        await updateOrder(ref, { payRef: data.data.reference, channel: "paystack" });
        return NextResponse.json({ ok: true, orderRef: ref, payUrl: data.data.authorization_url });
      }
      // fall through to fallback if Paystack init failed
      await updateOrder(ref, { payError: data.message || "paystack init failed" });
    }

    // --- static fallback payment link ---
    if (process.env.NEXT_PUBLIC_FALLBACK_PAYMENT_LINK) {
      await updateOrder(ref, { channel: "payment_link" });
      return NextResponse.json({
        ok: true,
        orderRef: ref,
        payUrl: process.env.NEXT_PUBLIC_FALLBACK_PAYMENT_LINK,
        note: "Complete payment with the link; keep your order ref for confirmation.",
      });
    }

    // --- manual confirmation flow ---
    await updateOrder(ref, { channel: "manual" });
    return NextResponse.json({
      ok: true,
      orderRef: ref,
      payUrl: null,
      note: "Order received. We'll confirm payment with you shortly.",
    });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Something splattered." }, { status: 500 });
  }
}
