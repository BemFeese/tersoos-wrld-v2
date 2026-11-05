import CommissionForm from "../../components/CommissionForm";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";

export const metadata = { title: "Commission — Tersoo's Wrld" };

export default function CommissionPage() {
  return (
    <main style={{ paddingTop: "var(--nav-h)" }}>
      <section className="section commission-head">
        <p className="section-label" style={{ justifyContent: "center" }}>CØMMISSIONS — ØPEN</p>
        <Reveal as="h1" className="section-title" style={{ marginBottom: "1rem", fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          Have something that <span style={{ color: "var(--ox)" }}>needs saying?</span>
        </Reveal>
        <p className="lede">
          Covers, brands, portraits of you — glitched on purpose. Or something else entirely,
          which is his favourite. Tell him the message, not just the medium.
        </p>
        <span className="hand">
          “don&apos;t tell me what you want it to look like. tell me what you want it to feel like.” — T.
        </span>
      </section>
      <CommissionForm />
      <Footer />
    </main>
  );
}
