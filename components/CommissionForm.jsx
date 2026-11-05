"use client";

import { useState } from "react";
import { commissionTypes, commissionBudgets, commissionTimelines } from "../lib/data";

/* ------------------------------------------------------------
   Commission — brief the artist directly.
   Goes to /api/commission → data/commissions.json as CM-XXXX.
   ------------------------------------------------------------ */

export default function CommissionForm() {
  const [f, setF] = useState({
    name: "", email: "", phone: "", type: commissionTypes[0],
    budget: "", timeline: "", brief: "", reference: "",
  });
  const [state, setState] = useState("form");
  const [ref, setRef] = useState(null);
  const [error, setError] = useState("");

  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "splat");
      setRef(data.ref);
      setState("done");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  }

  return (
    <section className="section" style={{ maxWidth: 720, margin: "0 auto", paddingLeft: "var(--pad)", paddingRight: "var(--pad)" }}>
      {state === "form" && (
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="cm-name">YOUR NAME</label>
            <input id="cm-name" required value={f.name} onChange={set("name")} placeholder="Who wants art made?" />
          </div>
          <div className="field">
            <label htmlFor="cm-email">EMAIL</label>
            <input id="cm-email" type="email" required value={f.email} onChange={set("email")} placeholder="you@wrld.com" />
          </div>
          <div className="field">
            <label htmlFor="cm-phone">PHONE / WHATSAPP (for the fast lane)</label>
            <input id="cm-phone" value={f.phone} onChange={set("phone")} placeholder="+234 ..." />
          </div>
          <div className="field">
            <label htmlFor="cm-type">WHAT KIND OF WRLD-MAKING?</label>
            <select id="cm-type" value={f.type} onChange={set("type")}>
              {commissionTypes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label>BUDGET — HONESTY GETS A FASTER YES</label>
            <div className="budget-row">
              {commissionBudgets.map((b) => (
                <button type="button" key={b} className={`chip${f.budget === b ? " on" : ""}`} onClick={() => setF((v) => ({ ...v, budget: v.budget === b ? "" : b }))}>
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label htmlFor="cm-timeline">TIMELINE</label>
            <select id="cm-timeline" value={f.timeline || ""} onChange={set("timeline")}>
              <option value="">— pick a rhythm —</option>
              {commissionTimelines.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="cm-brief">THE BRIEF — SPEAK FROM THE WRST (20+ characters)</label>
            <textarea id="cm-brief" required rows={5} value={f.brief} onChange={set("brief")}
              placeholder="What should exist after this conversation? What message must it carry? Reference links welcome below." />
          </div>
          <div className="field">
            <label htmlFor="cm-ref">REFERENCE LINK (optional)</label>
            <input id="cm-ref" value={f.reference} onChange={set("reference")} placeholder="https:// ..." />
          </div>
          <button className="checkout-btn" type="submit">SEND THE BRÌEF → TERSOO READS THEM HIMSELF</button>
        </form>
      )}

      {state === "sending" && (
        <div className="pay-done">
          <div className="big">Opening the envelope…</div>
        </div>
      )}

      {state === "done" && (
        <div className="pay-done">
          <div className="big">Brief <span className="miss">stamped</span> ✕</div>
          <p>Ref <strong style={{ color: "var(--ink)" }}>{ref}</strong>. Tersoo reads every brief himself — expect a reply within 48 hours, from the wrld.</p>
          <p style={{ marginTop: "1.4rem" }}><a className="story-link" href="/">BACK TO THE WRLD →</a></p>
        </div>
      )}

      {state === "error" && (
        <div className="pay-done">
          <div className="big" style={{ color: "var(--ox)" }}>Splotch.</div>
          <p>{error}</p>
          <p style={{ marginTop: "1rem" }}>
            <button className="story-link" style={{ background: "none", border: "none" }} onClick={() => setState("form")}>← back</button>
          </p>
        </div>
      )}
    </section>
  );
}
