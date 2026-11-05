"use client";

import { artworks } from "../lib/data";
import ArtSmart from "./ArtSmart";

/* ------------------------------------------------------------
   Intro + featured — one sentence, one work, all the air.
   ------------------------------------------------------------ */
export default function Intro() {
  const featured = artworks[0];
  return (
    <>
      <section className="intro">
        <div className="intro-row">
          <div>
            <h1>
              Tersoo Dzoho — graphic designer &amp; illustrator.
              <br />
              He makes <em>visuals that say something</em>, quietly.
            </h1>
            <div className="intro-meta">
              <span>PORTFOLIO</span>
              <span>WRLDSHOP</span>
              <span>COMMISSIONS — OPEN</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: ".7rem", flexWrap: "wrap" }}>
            <a className="intro-cta" href="#work">SEE THE WORK</a>
            <a className="intro-cta ghost" href="/shop">SHOP PRINTS</a>
          </div>
        </div>

        <a className="featured-link" href="#work">
          <div className="featured-frame">
            <ArtSmart src={featured?.img} title={featured?.title || "MONSTROÏD MÒBILE"} alt={featured?.title} />
          </div>
          <div className="featured-cap">
            <span className="t">{featured?.title} <em>— official cover art</em></span>
            <span className="k">7,000+ downloads · app stores</span>
          </div>
        </a>
      </section>
    </>
  );
}
