import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  COMPANY_COUNTRY,
  COMPANY_DOMICILE,
  COMPANY_LEGAL_NAME,
  COMPANY_NAME,
  COMPANY_SUPPORT_EMAIL,
  getCompanyLegalLabel,
} from "@/consts";

const LEGAL_DIR = path.join(process.cwd(), "content/legal");

export type TLegalDocumentSlug = "terms-of-service" | "privacy-policy";

export type TLegalDocument = {
  slug: TLegalDocumentSlug;
  title: string;
  description?: string;
  updatedAt: string;
  content: string;
};

const applyPlaceholders = (source: string) => {
  const legalLabel = getCompanyLegalLabel();
  const hasLegalEntity = Boolean(COMPANY_LEGAL_NAME.trim());

  return source
    .replaceAll("{{COMPANY_NAME}}", COMPANY_NAME)
    .replaceAll("{{COMPANY_LEGAL_LABEL}}", legalLabel)
    .replaceAll("{{COMPANY_COUNTRY}}", COMPANY_COUNTRY)
    .replaceAll("{{COMPANY_DOMICILE}}", COMPANY_DOMICILE)
    .replaceAll("{{COMPANY_SUPPORT_EMAIL}}", COMPANY_SUPPORT_EMAIL)
    .replaceAll(
      "{{COMPANY_ENTITY_NOTE}}",
      hasLegalEntity
        ? " y, cuando corresponda, a las personas o entidades que operen la marca."
        : `. Mientras no exista una sociedad formalmente constituida, ${COMPANY_NAME} opera como marca comercial del prestador del servicio. Cuando se registre la sociedad titular, su razón social y NIT se actualizarán en la constante de empresa del producto y en estos términos, sin que ese solo cambio de identificación exija aceptar un contrato nuevo, salvo que la ley disponga lo contrario.`,
    )
    .replaceAll(
      "{{PRIVACY_ENTITY_NOTE}}",
      hasLegalEntity
        ? "."
        : `, marca bajo la cual se presta el servicio. Cuando exista sociedad registrada, se indicará aquí su razón social y NIT.`,
    );
};

export function getLegalDocument(
  slug: TLegalDocumentSlug,
): TLegalDocument | null {
  const filePath = path.join(LEGAL_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (typeof data.title !== "string" || !data.title.trim()) return null;

  return {
    slug,
    title: applyPlaceholders(data.title.trim()),
    description:
      typeof data.description === "string"
        ? applyPlaceholders(data.description.trim())
        : undefined,
    updatedAt:
      typeof data.updatedAt === "string" && data.updatedAt.trim()
        ? data.updatedAt.trim()
        : "Sin fecha",
    content: applyPlaceholders(content),
  };
}
