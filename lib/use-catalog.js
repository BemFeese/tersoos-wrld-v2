"use client";

import { useEffect, useState } from "react";

/* ------------------------------------------------------------
   useCatalog — the public side of Tersoo's self-serve postings.
   Fetches /api/catalog once; null until it lands (then the
   sections simply show curated pieces only — no flicker to
   notice, art just appears when he posts it).
   ------------------------------------------------------------ */

export default function useCatalog() {
  const [cat, setCat] = useState(null);

  useEffect(() => {
    let dead = false;
    fetch("/api/catalog")
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => {
        if (!dead && b) setCat(b);
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, []);

  return cat;
}
