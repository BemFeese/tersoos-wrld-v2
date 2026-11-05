"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { naira } from "../../lib/cart-store";

/* ------------------------------------------------------------
   /admin?key=… — the artist's back office.
   Orders, commission briefs, the newsletter head-count.
   The key lives in .env.local: ADMIN_KEY=…
   ------------------------------------------------------------ */

function BackOffice() {
  const params = useSearchParams();
  const [key, setKey] = useState(params.get("key") || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("orders");

  async function load(k) {
    setError("");
    try {
      const res = await fetch("/api/admin?key=" + encodeURIComponent(k));
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "nope");
      setData(body);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  }

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) {
    return (
      <main className="admin">
        <div className="admin-gate">
          <h1 className="admin-title">BACK <span className="miss">ØFFÌCE</span></h1>
          <form
            onSubmit={(e) => { e.preventDefault(); load(key); }}
            style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "center" }}
          >
            <input
              className="admin-input"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="ADMIN_KEY"
              aria-label="Admin key"
            />
            <button className="admin-btn">ØPEN</button>
          </form>
          {error && <p className="gate-error">{error}</p>}
          <p style={{ color: "#a9a39a", marginTop: "1.6rem", fontSize: ".75rem" }}>
            The key lives in <code>.env.local</code> as <code>ADMIN_KEY=…</code>
          </p>
        </div>
      </main>
    );
  }

  const paid = data.orders.filter((o) => o.status === "paid").length;
  const revenue = data.orders.filter((o) => o.status === "paid").reduce((n, o) => n + (o.total || 0), 0);

  return (
    <main className="admin">
      <header className="admin-head">
        <h1 className="admin-title">BACK <span className="miss">ØFFÌCE</span></h1>
        <div className="admin-stats">
          <span><strong>{data.orders.length}</strong> ØRDERS</span>
          <span><strong>{paid}</strong> PAÌD</span>
          <span><strong>{naira(revenue)}</strong> PAÌD VÒLUME</span>
          <span><strong>{data.commissions.length}</strong> BRÌEFS</span>
          <span><strong>{data.subscribers.length}</strong> SUBSCRÌBERS</span>
        </div>
      </header>

      <nav className="admin-tabs">
        {["orders", "commissions", "subscribers"].map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </nav>

      {tab === "orders" && (
        <div className="admin-list">
          {data.orders.length === 0 && <p className="admin-empty">No orders yet — the wrld is patient.</p>}
          {data.orders.slice().reverse().map((o) => (
            <article className="admin-card" key={o.ref}>
              <div className="admin-row">
                <strong>{o.ref}</strong>
                <span className={`admin-status ${o.status}`}>{o.status}</span>
              </div>
              <div className="admin-row dim">
                <span>{o.buyer?.name} · {o.buyer?.email} · {o.buyer?.phone}</span>
                <strong>{naira(o.total || 0)}</strong>
              </div>
              <ul className="admin-lines">
                {(o.lines || []).map((l, i) => (
                  <li key={i}>{l.qty}× {l.name}{l.size ? " (" + l.size + ")" : ""} — {naira(l.amount)}</li>
                ))}
              </ul>
              <div className="admin-row dim">
                <span>{o.createdAt?.slice(0, 16).replace("T", " ")} · {o.address}</span>
                <span>{o.channel || ""}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === "commissions" && (
        <div className="admin-list">
          {data.commissions.length === 0 && <p className="admin-empty">No briefs yet.</p>}
          {data.commissions.slice().reverse().map((c) => (
            <article className="admin-card" key={c.ref}>
              <div className="admin-row">
                <strong>{c.ref}</strong>
                <span className="admin-status new">{c.type}</span>
              </div>
              <div className="admin-row dim">
                <span>{c.name} · {c.email} · {c.phone || "—"}</span>
                <span>{c.budget || "—"} · {c.timeline || "—"}</span>
              </div>
              <p className="admin-brief">“{c.brief}”</p>
            </article>
          ))}
        </div>
      )}

      {tab === "subscribers" && (
        <div className="admin-list">
          <article className="admin-card">
            <div className="admin-row"><strong>{data.subscribers.length} of the wrld</strong></div>
            <ul className="admin-lines">
              {data.subscribers.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </article>
        </div>
      )}
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense>
      <BackOffice />
    </Suspense>
  );
}
