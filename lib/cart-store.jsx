"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";

// ------------------------------------------------------------
//  Cart store — lives in localStorage, hydrated on load.
//  Item shape: { id, name, price, size, colorway, qty, img }
// ------------------------------------------------------------

const CART_KEY = "tersooswrld.cart.v1";
const CartCtx = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const k = (it) => it.id + "|" + (it.size || "") + "|" + (it.colorway || "");
      const found = state.find((it) => k(it) === k(action.item));
      if (found) {
        return state.map((it) => (k(it) === k(action.item) ? { ...it, qty: it.qty + 1 } : it));
      }
      return [...state, { ...action.item, qty: 1 }];
    }
    case "qty":
      return state
        .map((it, i) => (i === action.index ? { ...it, qty: Math.max(0, it.qty + action.delta) } : it))
        .filter((it) => it.qty > 0);
    case "remove":
      return state.filter((_, i) => i !== action.index);
    case "clear":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {}
    }
  }, [items, hydrated]);

  // lock body scroll while the drawer is open
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  const value = useMemo(() => {
    const count = items.reduce((n, it) => n + it.qty, 0);
    const total = items.reduce((n, it) => n + it.qty * it.price, 0);
    return {
      items, count, total,
      add: (item) => { dispatch({ type: "add", item }); setOpen(true); },
      qty: (index, delta) => dispatch({ type: "qty", index, delta }),
      remove: (index) => dispatch({ type: "remove", index }),
      clear: () => dispatch({ type: "clear" }),
      open, setOpen,
    };
  }, [items, open]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  return useContext(CartCtx);
}

export function naira(kobo) {
  return "₦" + (kobo / 100).toLocaleString("en-NG", { maximumFractionDigits: 0 });
}
