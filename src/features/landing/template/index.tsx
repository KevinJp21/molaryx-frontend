import {
  Navbar,
  HeroSection,
  FeaturesSection,
  PricingSection,
} from "../components";

export const LandingTemplate = () => {
  return (
    <div id="top">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
};

export default LandingTemplate;
