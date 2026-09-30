import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { ProductIntro } from "./components/ProductIntro";
import { HowItWorks } from "./components/HowItWorks";
import { FeatureSection } from "./components/FeatureSection";
import { Workflow } from "./components/Workflow";
import { InteractiveDashboard } from "./components/InteractiveDashboard";
import { Testimonials } from "./components/Testimonials";
import { Security } from "./components/Security";
import { Pricing } from "./components/Pricing";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <ProductIntro />
        <HowItWorks />
        <FeatureSection />
        <Workflow />
        <InteractiveDashboard />
        <Testimonials />
        <Security />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
