"use client";

import type { IGetPublicPlans } from "@/features/public-plans";
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

type Props = {
  plans: IGetPublicPlans[];
  plansError?: string;
};

export const LandingTemplate = ({ plans, plansError }: Props) => {
  return (
    <SmoothScroll>
      <div id="top">
        <ScrollProgress />
        <Navbar />
        <HeroSection />
        <DashboardSection />
        <FeaturesSection />
        <PricingSection plans={plans} plansError={plansError} />
        <CtaSection />
        <FooterSection />
      </div>
    </SmoothScroll>
  );
};

export default LandingTemplate;
