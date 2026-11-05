"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "../lib/cart-store";
import CartDrawer from "./CartDrawer";
import CheckoutModal from "./CheckoutModal";

/* ------------------------------------------------------------
   Chrome v2 — the quiet frame. The site disappears; the art stays.
   ------------------------------------------------------------ */

function Nav() {
  const pathname = usePathname();
  const cart = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const links = [
    { href: "/", label: "Work" },
    { href: "/shop", label: "Shop" },
    { href: "/commission", label: "Commission" },
  ];
  return (
    <nav className="nav">
      <a href="/" className="nav-logo" aria-label="TERSOO'S WRLD home">
        TERSOO&apos;S <em>WRLD</em>
      </a>
      <div className="nav-links">
        {links.map((l) => (
          <a key={l.label} href={l.href} className={pathname === l.href ? "active" : ""}>
            {l.label}
          </a>
        ))}
        <button className="nav-cart" onClick={() => cart.setOpen(true)}>
          Cart
          {mounted && cart.count > 0 && <span className="badge">{cart.count}</span>}
        </button>
      </div>
    </nav>
  );
}

export default function Chrome() {
  const [checkout, setCheckout] = useState(false);

  return (
    <>
      <Nav />
      <CartDrawer onCheckout={() => setCheckout(true)} />
      {checkout && <CheckoutModal onClose={() => setCheckout(false)} />}
    </>
  );
}
