import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Logo } from "@/components";
import { COMPANY_NAME } from "@/consts";
import type { TLegalDocument } from "@/lib/legal/get-legal-document";
import { legalMdxComponents } from "./legal-mdx-components";

type Props = {
  document: TLegalDocument;
};

export const LegalDocumentTemplate = async ({ document }: Props) => {
  const body = await MDXRemote({
    source: document.content,
    components: legalMdxComponents,
  });

  return (
    <div className="min-h-dvh bg-ink-50 text-ink-900">
      <header className="sticky top-0 z-40 border-b border-ink-200/80 bg-ink-50/90 backdrop-blur-md">
        <div className="container-px mx-auto flex h-14 max-w-3xl items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Logo size={24} />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-950"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="container-px mx-auto max-w-3xl py-10 sm:py-14">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-600">
          Última actualización: {document.updatedAt}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          {document.title}
        </h1>
        <div className="legal-mdx">{body}</div>
        <p className="mt-14 border-t border-ink-200 pt-6 text-xs text-ink-600">
          © {new Date().getFullYear()} {COMPANY_NAME}. Todos los derechos
          reservados.
        </p>
      </main>
    </div>
  );
};
