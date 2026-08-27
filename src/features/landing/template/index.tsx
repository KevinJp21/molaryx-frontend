import {
  Navbar,
  HeroSection,
  DashboardSection,
  FeaturesSection,
  PricingSection,
  CtaSection,
  FooterSection,
  ScrollProgress,
  SmoothScroll,
} from "../components";

export const LandingTemplate = () => {
  return (
    <SmoothScroll>
      <div id="top">
        <ScrollProgress />
        <Navbar />
        <HeroSection />
        <DashboardSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
        <FooterSection />
      </div>
    </SmoothScroll>
  );
};

export default LandingTemplate;
