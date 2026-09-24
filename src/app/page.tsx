import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StockTicker } from "@/components/StockTicker";
import { PromoBanner } from "@/components/PromoBanner";
import { MenuSection } from "@/components/MenuSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <StockTicker />
      <div className="wrap">
        <PromoBanner />
      </div>
      <MenuSection />
      <Footer />
    </>
  );
}
