import {
  Navbar,
  DashboardSection,
  HeroSection,
  FeaturesSection,
  PricingSection,
} from "../components";

export const LandingTemplate = () => {
  return (
    <div id="top">
      <Navbar />
      <HeroSection />
      <DashboardSection />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
};

export default LandingTemplate;
