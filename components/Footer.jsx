"use client";

import { useState } from "react";
import { site } from "../lib/data";

/* Footer v2 — a quiet close. One line, the links, one signature. */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function subscribe(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMsg(res.ok ? "you're inside the wrld now ✕" : "hmm, try again");
      if (res.ok) setEmail("");
    } catch {
      setMsg("hmm, try again");
    }
  }

  return (
    <footer className="footer" id="contact">
      <div className="footer-grid">
        <div>
          <h2 className="footer-title">
            Get every drop, <em>quietly</em>.
          </h2>
          <span className="hand" style={{ marginTop: ".5rem" }}>new work lands here first — no noise, ever</span>
          <form className="news-form" onSubmit={subscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@wrld.com"
              aria-label="Email address"
            />
            <button type="submit">JOIN</button>
          </form>
          {msg && <span className="hand" style={{ marginTop: ".7rem", display: "inline-block" }}>{msg}</span>}
        </div>
        <div className="footer-links">
          <a href="/commission">COMMISSIONS →</a>
          <a href={"mailto:" + site.email}>{site.email}</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">X / TWITTER ↗</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">YOUTUBE — THE PROCESS ↗</a>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} {site.artist}</span>
        <span className="hand">every misspelling on purpose</span>
        <span>{site.role}</span>
      </div>
    </footer>
  );
}
