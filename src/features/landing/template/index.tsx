import {
  Navbar,
  DashboardSection,
  HeroSection,
  FeaturesSection,
  PricingSection,
} from "../components";
import Link from "next/link";
import { COMPANY_NAME } from "@/consts";

export const LandingTemplate = () => {
  return (
    <div id="top">
      <Navbar />
      <HeroSection />
      <DashboardSection />
      <FeaturesSection />
      <PricingSection />
      <footer className="border-t border-ink-800/80 py-8">
        <div className="container-px mx-auto flex max-w-360 flex-col items-center justify-between gap-3 text-sm text-ink-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY_NAME}. Todos los derechos
            reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
            <Link
              href="/terms-of-service"
              className="font-medium text-ink-300 transition-colors hover:text-ink-50"
            >
              Términos y condiciones
            </Link>
            <Link
              href="/privacy-policy"
              className="font-medium text-ink-300 transition-colors hover:text-ink-50"
            >
              Política de privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingTemplate;
