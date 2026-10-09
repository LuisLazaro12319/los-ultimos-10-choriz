import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PromoBanner } from "@/components/PromoBanner";
import { MenuSection } from "@/components/MenuSection";
import { Footer } from "@/components/Footer";
import { ContadorVisitas } from "@/components/ContadorVisitas";

export default function Home() {
  return (
    <>
      <ContadorVisitas />
      <Header />
      <Hero />
      <div className="wrap">
        <PromoBanner />
      </div>
      <MenuSection />
      <Footer />
    </>
  );
}
