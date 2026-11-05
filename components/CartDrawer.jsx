"use client";

import { useCart, naira } from "../lib/cart-store";

/* Artwork thumbnail with graceful fallback */
export function Thumb({ src, seed, accent, className = "", alt = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.outerHTML = `<div class="art-placeholder"><span class="stain s1"></span><span class="stain s2"></span></div>`;
      }}
      data-ph={seed || ""}
    />
  );
}

export default function CartDrawer({ onCheckout }) {
  const cart = useCart();
  if (!cart.open) return null;

  return (
    <>
      <div className="scrim" onClick={() => cart.setOpen(false)} />
      <aside className="drawer" role="dialog" aria-label="Shopping cart">
        <div className="drawer-head">
          <h3>YOUR CART</h3>
          <button className="drawer-close" onClick={() => cart.setOpen(false)} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer-items">
          {cart.items.length === 0 ? (
            <div className="drawer-empty">
              <div className="big">Empty. Like a canvas.</div>
              <span className="hand">the wrld is waiting to be filled</span>
            </div>
          ) : (
            cart.items.map((it, i) => (
              <div className="d-item" key={it.id + (it.size || "") + (it.colorway || "")}>
                <Thumb src={it.img} accent={it.accent} className="d-thumb" alt={it.name} />
                <div className="d-info">
                  <div className="d-name">{it.name}</div>
                  <div className="d-var">{[it.size, it.colorway].filter(Boolean).join(" · ")}</div>
                </div>
                <div className="d-right">
                  <strong>{naira(it.price * it.qty)}</strong>
                  <span className="d-qty">
                    <button onClick={() => cart.qty(i, -1)} aria-label="Decrease">−</button>
                    {it.qty}
                    <button onClick={() => cart.qty(i, 1)} aria-label="Increase">+</button>
                  </span>
                  <button className="d-rm" onClick={() => cart.remove(i)}>remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="drawer-foot">
            <div className="d-total">
              <span>Total</span>
              <strong>{naira(cart.total)}</strong>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>CHECKOUT →</button>
          </div>
        )}
      </aside>
    </>
  );
}
