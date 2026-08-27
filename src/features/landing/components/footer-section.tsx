import Link from "next/link";
import { Logo } from "@/components";
import { COMPANY_NAME } from "@/consts";
import { Reveal } from "./motion";

const PRODUCT_LINKS = [
  { label: "Tu panel", href: "/#dashboard" },
  { label: "Funcionalidades", href: "/#features" },
  { label: "Planes", href: "/#pricing" },
] as const;

const ACCOUNT_LINKS = [
  { label: "Iniciar sesión", href: "/sign-in" },
  { label: "Crear cuenta", href: "/sign-up" },
] as const;

const LEGAL_LINKS = [
  { label: "Términos y condiciones", href: "/legal/terms-of-service" },
  { label: "Política de privacidad", href: "/legal/privacy-policy" },
] as const;

const FOOTER_COLUMNS = [
  { title: "Producto", links: PRODUCT_LINKS },
  { title: "Cuenta", links: ACCOUNT_LINKS },
  { title: "Legal", links: LEGAL_LINKS },
] as const;

export const FooterSection = () => {
  return (
    <footer className="border-t border-ink-800/80">
      <div className="default-container container-px mx-auto py-14 sm:py-16">
        <Reveal variant="up" duration={0.8}>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-8">
            <div className="max-w-sm">
              <Link href="/#top" scroll={false} className="inline-flex items-center leading-none">
                <Logo size={28} />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-ink-300">
                Pacientes, historia clínica, agenda, procedimientos y pagos en una sola
                plataforma para consultorios de cualquier especialidad.
              </p>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-400">
                  {column.title}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        scroll={link.href.includes("#")}
                        className="text-sm text-ink-300 transition-colors duration-200 hover:text-ink-50"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 border-t border-ink-800/80 pt-6">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} {COMPANY_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
