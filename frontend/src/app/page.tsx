import HeroSection from "@/modules/home/components/HeroSection";
import HowItWorks from "@/modules/home/components/HowItWorks";
import WhyChoose from "@/modules/home/components/WhyChoose";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <WhyChoose />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
