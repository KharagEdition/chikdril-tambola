import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DownloadSection />
      <Footer />
    </main>
  );
}
