import HeroIntro from "../components/Intro";
import Gallery from "../components/Gallery";
import Shop from "../components/Shop";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <HeroIntro />
      <Gallery />
      <Shop compact />
      <Footer />
    </main>
  );
}
