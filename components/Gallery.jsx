"use client";

import { useState } from "react";
import { artworks } from "../lib/data";
import useCatalog from "../lib/use-catalog";
import ArtSmart from "./ArtSmart";
import Reveal from "./Reveal";

/* ------------------------------------------------------------
   Works — a raked gallery wall. Rounded frames, soft light,
   and room for the art to breathe. Click a piece for its story.
   ------------------------------------------------------------ */

const SPEECH = ["ALL", "DIGITAL", "TRADITIØNAL", "MOTION", "MESSAGES", "PØRTRAITS"];

function pieceSpeaks(piece, speech) {
  if (speech === "ALL") return true;
  if (speech === "TRADITIØNAL")
    return piece.tags?.some((t) => /traditional/i.test(t)) || /poster colour|hand-crafted/i.test(piece.kind);
  if (speech === "MESSAGES") return piece.tags?.some((t) => /message|symbolism/i.test(t));
  return piece.tags?.some((t) => new RegExp(speech.replace(/[ØÌËÈ]/g, "."), "i").test(t));
}

function StoryTitle({ title }) {
  return (
    <h3 className="story-title">
      {[...title].map((ch, i) =>
        /[ÀÁÂÈÉÊËÌÍÏÒÓÖÙÚÜÅÆÇØ]+/.test(ch) ? <span className="miss" key={i}>{ch}</span> : ch
      )}
    </h3>
  );
}

function StoryModal({ piece, onClose }) {
  if (!piece) return null;
  return (
    <div className="modal-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-label={piece.title}>
        <button className="modal-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="story-media">
          <ArtSmart src={piece.img} title={piece.title} />
        </div>
        <div className="story-kicker">
          {piece.kind} — {piece.year} {piece.tags?.length ? "· " + piece.tags.join(" · ") : ""}
        </div>
        <StoryTitle title={piece.title} />
        <p className="story-body">{piece.story}</p>
        {piece.link && (
          <a className="story-link" href={piece.link} target="_blank" rel="noreferrer">
            {piece.linkLabel || "SEE MORE"} →
          </a>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  const [story, setStory] = useState(null);
  const [speech, setSpeech] = useState("ALL");
  const cat = useCatalog();
  // his latest posting leads the wall, then the curated pieces
  const wall = [...(cat?.artworks || []), ...artworks];
  const shown = wall.filter((a) => pieceSpeaks(a, speech));

  return (
    <section className="section" id="work">
      <p className="section-label">SËLECTED WÒRKS</p>
      <h2 className="section-title">Works that speak. Click any piece for the message behind it.</h2>

      <div className="filters">
        {SPEECH.map((s) => (
          <button key={s} className={speech === s ? "on" : ""} onClick={() => setSpeech(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="works-grid">
        {shown.map((piece, i) => (
          <Reveal key={piece.id} delay={(i % 4) * 60}>
            <figure className="work-card" onClick={() => setStory(piece)} style={{ cursor: "pointer", margin: 0 }}>
              <div className="work-frame">
                <ArtSmart src={piece.img} title={piece.title} alt={piece.title} />
              </div>
              <figcaption className="work-cap">
                <div className="t">{piece.title}</div>
                <div className="work-sub">
                  <span>{piece.kind}</span>
                  <span>{piece.year}</span>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <StoryModal piece={story} onClose={() => setStory(null)} />
    </section>
  );
}
