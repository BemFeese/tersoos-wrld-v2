"use client";

import { products, originals } from "../lib/data";
import ArtSmart from "./ArtSmart";
import Reveal from "./Reveal";
import { useCart, naira } from "../lib/cart-store";
import { useState } from "react";

/* ------------------------------------------------------------
   WRLDSHOP v2 — veryveig calm, rakitecht edition-soul.
   Image, name, edition note, price. Nothing shouts.
   ------------------------------------------------------------ */

const COLLECTIONS = ["ALL", "TEES", "PRINTS", "OBJECTS"];

function ProductCard({ p }) {
  const cart = useCart();
  const [size, setSize] = useState(p.sizes ? p.sizes[0] : null);
  const sold = p.stock <= 0;

  const add = () => {
    cart.add({ id: p.id, name: p.name, price: p.price, size: size || undefined, colorway: p.colorway, img: p.img, accent: p.accent });
  };

  return (
    <article className="p-card">
      <div className="p-frame">
        <span className="p-edition">{p.editions}</span>
        {sold && <div className="p-sold">SØLD</div>}
        <ArtSmart src={p.img} title={p.name} className="" alt={p.name} quiet />
      </div>
      <div className="p-info">
        <h3 className="p-name">{p.name}</h3>
        <span className="p-ed">{p.collection}</span>
        <p className="p-blurb">{p.blurb}</p>
        {p.sizes && (
          <div className="p-opt" role="radiogroup" aria-label={`sizes for ${p.name}`}>
            {p.sizes.map((s) => (
              <button key={s} type="button" className={s === size ? "sel" : ""} disabled={sold} onClick={() => setSize(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="p-row">
          <span className="p-price">{naira(p.price)}</span>
          <button className="p-add" disabled={sold} onClick={add}>
            {sold ? "GØNE" : "ADD"}
          </button>
        </div>
      </div>
    </article>
  );
}

function OriginalCard({ p }) {
  const cart = useCart();
  const sold = p.stock <= 0;
  return (
    <article className="oo-card">
      <div className="oo-frame">
        <span className="p-edition">{p.editions}</span>
        {sold && <div className="p-sold">HØME SØMEDAY</div>}
        <ArtSmart src={p.img} title={p.name} alt={p.name} quiet />
        <span className="oo-med">{p.medium}</span>
      </div>
      <div className="oo-body">
        <h3 className="p-name">{p.name}</h3>
        <p className="p-blurb">{p.blurb}</p>
        <span className="oo-cert">ships with the Certificate of Misspelling — hand-signed ✕</span>
        <div className="p-row">
          <span className="p-price">{naira(p.price)}</span>
          <button className="p-add" disabled={sold} onClick={() => cart.add({ id: p.id, name: p.name, price: p.price, img: p.img, accent: p.accent })}>
            {sold ? "ØWNED" : "ACQUIRE"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Shop({ compact = false }) {
  const [col, setCol] = useState("ALL");
  const shown = (col === "ALL" ? products : products.filter((p) => p.collection === col)).slice(
    0,
    compact && col === "ALL" ? 4 : undefined
  );
  const available = originals.filter((p) => p.stock > 0);

  return (
    <section className="section" id="shop">
      <p className="section-label">WRLDSHOP</p>
      <div className="shop-head">
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          {compact ? "Own a piece of it." : "Every painting, from his table to your wall."}
        </h2>
        {compact && <a className="see" href="/shop">SEE EVERYTHING →</a>}
      </div>

      {!compact && (
        <div className="filters">
          {COLLECTIONS.map((c) => (
            <button key={c} className={col === c ? "on" : ""} onClick={() => setCol(c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="shop-grid">
        {shown.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>

      <div className="oo-band">
        <div className="rule" />
        <div className="shop-head">
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Buy the <span style={{ color: "var(--ox)" }}>painting</span>, not the print.
          </h2>
          {compact && available.length > 0 && <a className="see" href="/shop">1/1 GALLERY →</a>}
        </div>
        <div className="oo-grid">
          {(compact ? available.slice(0, 1) : originals).map((p) => <OriginalCard key={p.id} p={p} />)}
        </div>
        {!compact && (
          <p className="oo-note">
            one of one means: no reprints, no restock, no second chance. every 1/1 ships with the
            hand-signed Certificate of Misspelling. when it&apos;s gone, it belongs to someone&apos;s wall.
          </p>
        )}
      </div>
    </section>
  );
}
