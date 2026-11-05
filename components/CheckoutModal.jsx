"use client";

import { useState } from "react";
import { useCart, naira } from "../lib/cart-store";
import { site } from "../lib/data";

/* ------------------------------------------------------------
   CheckoutModal
   1. collects buyer info
   2. posts the cart to /api/checkout (server validates prices,
      saves the order, and — if a Paystack secret key exists —
      initializes a real payment transaction)
   3. redirects to Paystack, or shows the fallback link / order ref
   ------------------------------------------------------------ */

export default function CheckoutModal({ onClose }) {
  const cart = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", note: "" });
  const [state, setState] = useState("form"); // form | sending | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer: form,
          items: cart.items.map((it) => ({
            id: it.id, qty: it.qty, size: it.size || null, colorway: it.colorway || null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      setResult(data);
      setState("done");
      cart.clear();
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  }

  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-label="Checkout">
        <button className="modal-x" onClick={onClose} aria-label="Close">✕</button>

        {state === "form" && (
          <>
            <div className="story-kicker">LAST STEP</div>
            <h3 className="story-title">Claim <span className="miss">yours</span></h3>
            {cart.count > 0 && (
              <p className="pay-notice">
                {cart.count} piece{cart.count > 1 ? "s" : ""} · {naira(cart.total)} — payments are handled securely by Paystack.
              </p>
            )}
            <form onSubmit={submit}>
              <div className="field">
                <label htmlFor="co-name">NAME</label>
                <input id="co-name" required value={form.name} onChange={set("name")} placeholder="AdaLorem Ipsum" />
              </div>
              <div className="field">
                <label htmlFor="co-email">EMAIL</label>
                <input id="co-email" type="email" required value={form.email} onChange={set("email")} placeholder="you@wrld.com" />
              </div>
              <div className="field">
                <label htmlFor="co-phone">PHONE / WHATSAPP</label>
                <input id="co-phone" required value={form.phone} onChange={set("phone")} placeholder="+234 ..." />
              </div>
              <div className="field">
                <label htmlFor="co-address">DELIVERY ADDRESS</label>
                <input id="co-address" required value={form.address} onChange={set("address")} placeholder="Where the art arrives" />
              </div>
              <div className="field">
                <label htmlFor="co-note">NOTE TO THE ARTIST (optional)</label>
                <input id="co-note" value={form.note} onChange={set("note")} placeholder="Spell my name wrong. On purpose." />
              </div>
              <button className="checkout-btn" type="submit" disabled={cart.items.length === 0}>
                PAY {cart.total ? naira(cart.total) : ""} SECURELY →
              </button>
            </form>
          </>
        )}

        {state === "sending" && (
          <div className="pay-done">
            <div className="big">Stamping…</div>
            <p>Sealing your order in the wrld&apos;s ledger.</p>
          </div>
        )}

        {state === "done" && result && (
          <div className="pay-done">
            <div className="big">Order <span className="miss">stamped</span> ✕</div>
            <p>
              Order ref: <strong style={{ color: "var(--ink)" }}>{result.orderRef}</strong>
            </p>
            {result.payUrl ? (
              <p style={{ marginTop: "1rem" }}>
                <a className="story-link" href={result.payUrl}>COMPLETE PAYMENT SECURELY →</a>
              </p>
            ) : (
              <p style={{ marginTop: "1rem" }}>
                We&apos;ll confirm payment with you on WhatsApp/email shortly.
                {site.email && <> Or reach us at <a href={"mailto:" + site.email} style={{ textDecoration: "underline" }}>{site.email}</a>.</>}
              </p>
            )}
          </div>
        )}

        {state === "error" && (
          <div className="pay-done">
            <div className="big" style={{ color: "var(--ox)" }}>Splotch.</div>
            <p>{error} — nothing was charged. Try again, or message us.</p>
            <p style={{ marginTop: "1rem" }}>
              <button className="story-link" style={{ background: "none", border: "none" }} onClick={() => setState("form")}>← back</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
