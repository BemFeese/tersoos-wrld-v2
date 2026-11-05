"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------
   ArtSmart — shows /public/art/…jpg when the file exists,
   otherwise paints a quiet paper stand-in with oxblood stains.
   Tersoo never has to touch code: drop the file, it just appears.
   ------------------------------------------------------------ */

export default function ArtSmart({ src, title, accent, className = "", alt, quiet = false }) {
  const [broken, setBroken] = useState(false);
  const ref = useRef(null);

  // An image can 404 before React attaches onError (SSR race),
  // so probe its load state a few times after mount.
  // Only a *finished* request (complete) with zero content counts as broken —
  // a slow big artwork is never falsely swapped out.
  useEffect(() => {
    let tries = 0;
    const t = setInterval(() => {
      const img = ref.current;
      if (!img || broken) { clearInterval(t); return; }
      if (img.complete && img.naturalWidth === 0) { setBroken(true); clearInterval(t); }
      else if (++tries >= 6) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [broken]);

  if (broken || !src) {
    return (
      <div className={`art-placeholder ${className}`} aria-label={title}>
        <span className="stain s1" />
        <span className="stain s2" />
        <div className="ph-name">
          {title?.split(/([ÀÁÂÈÉÊËÌÍÏÒÓÖÙÚÜÅÆÇØË]+)/).map((ch, i) =>
            /[ÀÁÂÈÉÊËÌÍÏÒÓÖÙÚÜÅÆÇØË]+/.test(ch) ? <span className="ox" key={i}>{ch}</span> : ch
          )}
        </div>
        {!quiet && src && <div className="ph-note">→ drop /{src.replace(/^\//, "")} into /public</div>}
      </div>
    );
  }
  return (
    <img
      ref={ref}
      src={src}
      alt={alt || title}
      className={className}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}
