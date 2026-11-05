import Shop from "../../components/Shop";
import Footer from "../../components/Footer";

export const metadata = { title: "Shop — Tersoo's Wrld" };

export default function ShopPage() {
  return (
    <main style={{ paddingTop: "calc(var(--nav-h))" }}>
      <Shop />
      <Footer />
    </main>
  );
}
