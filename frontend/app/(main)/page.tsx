import HeroSection from "@/components/pages-ui/home/hero-section";
import HowItWorks from "@/components/pages-ui/home/HowItWorks";
import WhyChoose from "@/components/pages-ui/home/WhyChoose";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyChoose />
      <HowItWorks />
    </div>
  );
}
