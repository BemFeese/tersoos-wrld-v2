"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { naira } from "../../lib/cart-store";

/* ------------------------------------------------------------
   /admin?key=… — the artist's back office.
   ART tab:    post a new artwork straight to the works wall.
   SHOP tab:   post a product (or a 1/1 original) to the shop.
   Orders, commission briefs, the newsletter head-count.
   The key lives in .env.local: ADMIN_KEY=…
   ------------------------------------------------------------ */

const TABS = ["art", "shop", "orders", "commissions", "subscribers"];

// art files are heavy; the wall gets a lean JPEG instead
function fileToDataUrl(file, max = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No image selected."));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not an image."));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.naturalWidth * scale));
        c.height = Math.max(1, Math.round(img.naturalHeight * scale));
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function Upload({ name, dataUrl, onPick, hint }) {
  return (
    <label className="admin-field">
      <span className="lbl">{name}</span>
      <span className="admin-file">
        {hint}
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            try {
              onPick(await fileToDataUrl(f));
            } catch (err) {
              onPick(null, err.message);
            }
          }}
        />
      </span>
      {dataUrl && <img className="admin-preview" src={dataUrl} alt="" />}
    </label>
  );
}

const emptyArt = { title: "", kind: "", year: "", story: "", tags: "", link: "", linkLabel: "" };
const emptyShop = {
  type: "product",
  name: "",
  price: "",
  editions: "",
  stock: "",
  collection: "TEES",
  sizes: "",
  colorway: "",
  medium: "",
  blurb: "",
};

function BackOffice() {
  const params = useSearchParams();
  const [key, setKey] = useState(params.get("key") || "");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("art");

  const [art, setArt] = useState(emptyArt);
  const [artImg, setArtImg] = useState(null);
  const [artErr, setArtErr] = useState("");

  const [shop, setShop] = useState(emptyShop);
  const [shopImg, setShopImg] = useState(null);
  const [shopErr, setShopErr] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

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

  async function postItem(body, okMsg) {
    setBusy(true);
    setMsg("");
    setArtErr("");
    setShopErr("");
    try {
      const res = await fetch("/api/catalog?key=" + encodeURIComponent(key), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Could not post.");
      await load(key);
      setMsg(okMsg);
      return true;
    } catch (err) {
      if (body.kind === "artwork") setArtErr(err.message);
      else setShopErr(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function unPost(kind, id) {
    if (!confirm("Take this posting off the site?")) return;
    setBusy(true);
    setMsg("");
    setArtErr("");
    setShopErr("");
    try {
      const res = await fetch(
        "/api/catalog?key=" + encodeURIComponent(key) + "&kind=" + kind + "&id=" + encodeURIComponent(id),
        { method: "DELETE" }
      );
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Could not remove.");
      await load(key);
      setMsg("TAKEN DØWN.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const submitArt = async (e) => {
    e.preventDefault();
    setArtErr("");
    if (!artImg) {
      setArtErr("Pick an image of the work first.");
      return;
    }
    const ok = await postItem(
      {
        kind: "artwork",
        item: {
          ...art,
          tags: art.tags
            ? art.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          img: artImg,
        },
      },
      "PØSTED — it's live on the works wall."
    );
    if (ok) {
      setArt(emptyArt);
      setArtImg(null);
    }
  };

  const submitShop = async (e) => {
    e.preventDefault();
    setShopErr("");
    if (!shopImg) {
      setShopErr("Pick a photo of the piece first.");
      return;
    }
    const kobo = Math.round(Number(String(shop.price).replace(/[₦,\s]/g, "")) * 100);
    const stockNum = parseInt(String(shop.stock).trim(), 10);
    const shared = {
      name: shop.name,
      price: kobo,
      stock: stockNum,
      editions: shop.editions,
      blurb: shop.blurb,
      img: shopImg,
    };
    const body =
      shop.type === "original"
        ? { kind: "original", item: { ...shared, medium: shop.medium } }
        : {
            kind: "product",
            item: {
              ...shared,
              collection: shop.collection,
              sizes: shop.sizes
                ? shop.sizes.split(",").map((s) => s.trim()).filter(Boolean)
                : [],
              colorway: shop.colorway,
            },
          };
    const ok = await postItem(
      body,
      shop.type === "original"
        ? "PØSTED — it's live in the 1/1 gallery."
        : "PØSTED — it's live in the wrldshop."
    );
    if (ok) {
      setShop(emptyShop);
      setShopImg(null);
    }
  };

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

  const cat = data.catalog || { artworks: [], products: [], originals: [] };
  const posted = cat.artworks.length + cat.products.length + cat.originals.length;
  const paid = data.orders.filter((o) => o.status === "paid").length;
  const revenue = data.orders.filter((o) => o.status === "paid").reduce((n, o) => n + (o.total || 0), 0);
  const postingList = tab === "art" ? cat.artworks : [...cat.products, ...cat.originals];

  return (
    <main className="admin">
      <header className="admin-head">
        <h1 className="admin-title">BACK <span className="miss">ØFFÌCE</span></h1>
        <div className="admin-stats">
          <span><strong>{posted}</strong> PØSTÌNGS</span>
          <span><strong>{data.orders.length}</strong> ØRDERS</span>
          <span><strong>{paid}</strong> PAÌD</span>
          <span><strong>{naira(revenue)}</strong> PAÌD VÒLUME</span>
          <span><strong>{data.commissions.length}</strong> BRÌEFS</span>
          <span><strong>{data.subscribers.length}</strong> SUBSCRÌBERS</span>
        </div>
      </header>

      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </nav>

      {busy && <p className="admin-empty" style={{ marginBottom: "1rem" }}>wrld-ing…</p>}
      {msg && <p className="admin-ok" style={{ marginBottom: "1rem" }}>{msg}</p>}
      {error && <p className="gate-error" style={{ marginBottom: "1rem" }}>{error}</p>}

      {/* ---------- ART: post to the works wall ---------- */}
      {tab === "art" && (
        <>
          <form className="admin-form" onSubmit={submitArt}>
            <p className="admin-empty" style={{ margin: 0 }}>
              Post a new work straight to the wall — it leads it, in front of the classics.
            </p>
            <Upload
              name="the artwork"
              dataUrl={artImg}
              onPick={(d, e) => { setArtImg(d); if (e) setArtErr(e); }}
              hint="click to choose the image file — it gets resized for the wall automatically"
            />
            <div className="row2">
              <label className="admin-field">
                <span className="lbl">Title * <em style={{ textTransform: "none", letterSpacing: 0 }}>(misspellings encouraged)</em></span>
                <input value={art.title} onChange={(e) => setArt({ ...art, title: e.target.value })} placeholder="e.g. FRËE AT LÅST" required />
              </label>
              <label className="admin-field">
                <span className="lbl">Kind / medium</span>
                <input value={art.kind} onChange={(e) => setArt({ ...art, kind: e.target.value })} placeholder="e.g. Digital Art — Poster colour on paper" />
              </label>
            </div>
            <div className="row2">
              <label className="admin-field">
                <span className="lbl">Year</span>
                <input value={art.year} onChange={(e) => setArt({ ...art, year: e.target.value })} placeholder="e.g. 2026" />
              </label>
              <label className="admin-field">
                <span className="lbl">Tags <em style={{ textTransform: "none", letterSpacing: 0 }}>(comma separated)</em></span>
                <input value={art.tags} onChange={(e) => setArt({ ...art, tags: e.target.value })} placeholder="e.g. Digital, Symbolism" />
              </label>
            </div>
            <label className="admin-field">
              <span className="lbl">Its story</span>
              <textarea value={art.story} onChange={(e) => setArt({ ...art, story: e.target.value })} placeholder="What the piece says when nobody is looking…" />
            </label>
            <div className="row2">
              <label className="admin-field">
                <span className="lbl">A link (optional)</span>
                <input value={art.link} onChange={(e) => setArt({ ...art, link: e.target.value })} placeholder="https://youtube.com/shorts/…" />
              </label>
              <label className="admin-field">
                <span className="lbl">Link label</span>
                <input value={art.linkLabel} onChange={(e) => setArt({ ...art, linkLabel: e.target.value })} placeholder="WATCH THE PROCESS" />
              </label>
            </div>
            {artErr && <p className="gate-error" style={{ margin: 0 }}>{artErr}</p>}
            <button className="admin-btn" disabled={busy} style={{ justifySelf: "start" }}>PØST TØ THE WØRKS</button>
          </form>

          {cat.artworks.map((a) => (
            <article className="admin-card" key={a.id}>
              <div className="admin-row">
                <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
                  <img className="admin-thumb" src={a.img} alt="" />
                  <div>
                    <strong>{a.title}</strong>
                    <div className="admin-row dim" style={{ marginBottom: 0 }}>
                      <span>{a.kind} · {a.year} · posted {a.posted?.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>
                <button className="admin-del" onClick={() => unPost("artwork", a.id)}>TAKE DØWN</button>
              </div>
            </article>
          ))}
          {cat.artworks.length === 0 && <p className="admin-empty">Nothing posted yet — the wall is all classics.</p>}
        </>
      )}

      {/* ---------- SHOP: post to the wrldshop / 1/1 gallery ---------- */}
      {tab === "shop" && (
        <>
          <form className="admin-form" onSubmit={submitShop}>
            <p className="admin-empty" style={{ margin: 0 }}>
              Add something to the shop. Prices in naira — the site handles the kobo maths.
            </p>
            <div className="admin-seg">
              <button type="button" className={shop.type === "product" ? "on" : ""} onClick={() => setShop({ ...shop, type: "product" })}>
                WRLDSHOP LÌMÌTED
              </button>
              <button type="button" className={shop.type === "original" ? "on" : ""} onClick={() => setShop({ ...shop, type: "original" })}>
                1/1 ÒRÌGÌNAL
              </button>
            </div>
            <Upload
              name="photo of the piece"
              dataUrl={shopImg}
              onPick={(d, e) => { setShopImg(d); if (e) setShopErr(e); }}
              hint="click to choose the image file — resized on upload"
            />
            <div className="row2">
              <label className="admin-field">
                <span className="lbl">Name * </span>
                <input value={shop.name} onChange={(e) => setShop({ ...shop, name: e.target.value })} placeholder="e.g. FRËE AT LÅST POSTER" required />
              </label>
              <label className="admin-field">
                <span className="lbl">Price in ₦ *</span>
                <input value={shop.price} onChange={(e) => setShop({ ...shop, price: e.target.value })} placeholder="e.g. 19000" required inputMode="numeric" />
              </label>
            </div>
            <div className="row2">
              <label className="admin-field">
                <span className="lbl">Edition note</span>
                <input value={shop.editions} onChange={(e) => setShop({ ...shop, editions: e.target.value })} placeholder={shop.type === "original" ? "1 ÒF 1" : "ONLY 50 EVER / OPEN ËDITION"} />
              </label>
              <label className="admin-field">
                <span className="lbl">Stock * <em style={{ textTransform: "none", letterSpacing: 0 }}>(0 stamps it SOLD)</em></span>
                <input value={shop.stock} onChange={(e) => setShop({ ...shop, stock: e.target.value })} required inputMode="numeric" />
              </label>
            </div>
            {shop.type === "product" ? (
              <>
                <div className="row2">
                  <label className="admin-field">
                    <span className="lbl">Collection</span>
                    <select value={shop.collection} onChange={(e) => setShop({ ...shop, collection: e.target.value })}>
                      <option>TEES</option>
                      <option>PRINTS</option>
                      <option>OBJECTS</option>
                    </select>
                  </label>
                  <label className="admin-field">
                    <span className="lbl">Sizes <em style={{ textTransform: "none", letterSpacing: 0 }}>(comma separated, optional)</em></span>
                    <input value={shop.sizes} onChange={(e) => setShop({ ...shop, sizes: e.target.value })} placeholder="e.g. A3, A2, A1 FRAME" />
                  </label>
                </div>
                <label className="admin-field">
                  <span className="lbl">Colorway (optional)</span>
                  <input value={shop.colorway} onChange={(e) => setShop({ ...shop, colorway: e.target.value })} placeholder="e.g. BONE / INK" />
                </label>
              </>
            ) : (
              <label className="admin-field">
                <span className="lbl">Medium</span>
                <input value={shop.medium} onChange={(e) => setShop({ ...shop, medium: e.target.value })} placeholder="e.g. POSTER CÒLOUR ON PAPER" />
              </label>
            )}
            <label className="admin-field">
              <span className="lbl">Its blurb</span>
              <textarea value={shop.blurb} onChange={(e) => setShop({ ...shop, blurb: e.target.value })} placeholder="One quiet line to sell it without shouting…" />
            </label>
            {shopErr && <p className="gate-error" style={{ margin: 0 }}>{shopErr}</p>}
            <button className="admin-btn" disabled={busy} style={{ justifySelf: "start" }}>PØST TØ THE WRËLD SHOP</button>
          </form>

          {[...cat.products, ...cat.originals].map((p) => (
            <article className="admin-card" key={p.id}>
              <div className="admin-row">
                <div style={{ display: "flex", gap: ".8rem", alignItems: "center" }}>
                  <img className="admin-thumb" src={p.img} alt="" />
                  <div>
                    <strong>{p.name}</strong>
                    <div className="admin-row dim" style={{ marginBottom: 0 }}>
                      <span>{p.collection || ""} · {naira(p.price)} · stock {p.stock} · posted {p.posted?.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>
                <button
                  className="admin-del"
                  onClick={() => unPost(p.collection === "ORIGINALS" ? "original" : "product", p.id)}
                >
                  TAKE DØWN
                </button>
              </div>
            </article>
          ))}
          {cat.products.length + cat.originals.length === 0 && (
            <p className="admin-empty">The shop is all source-curated pieces — post the first new one.</p>
          )}
        </>
      )}

      {/* ---------- ORDERS ---------- */}
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

      {/* ---------- COMMISSIONS ---------- */}
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

      {/* ---------- SUBSCRIBERS ---------- */}
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
