import { NextResponse } from "next/server";
import { saveCommission } from "../../../lib/orderStore";

// ------------------------------------------------------------
//  POST /api/commission
//  A fan briefs the artist. Saved to data/commissions.json with
//  a CM-XXXX reference. No payment here — the artist replies,
//  agrees a price, then the buyer is sent a payment link
//  (Paystack initialize works for any amount when the key is set).
// ------------------------------------------------------------

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, type, budget, timeline, brief, reference } = body;

    if (!name || !email || !brief || brief.trim().length < 20) {
      return NextResponse.json(
        { error: "Name, email, and at least a real brief (20+ characters) are required." },
        { status: 400 }
      );
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "That email looks misspelled — even for us." }, { status: 400 });
    }

    const ref = "CM-" + Math.random().toString(16).slice(2, 8).toUpperCase();
    await saveCommission({
      ref,
      receivedAt: new Date().toISOString(),
      status: "new",
      name,
      email,
      phone: phone || null,
      type: type || "SOMETHÌNG ELSE ENTIRELY",
      budget: budget || null,
      timeline: timeline || null,
      brief: brief.trim().slice(0, 4000),
      reference: reference || null,
    });

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    return NextResponse.json({ error: err.message || "The brief splattered." }, { status: 500 });
  }
}
