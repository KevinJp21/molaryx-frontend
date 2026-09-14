/**
 * Nombre comercial / marca del producto.
 * Cuando exista sociedad registrada, actualiza aquí (y opcionalmente
 * COMPANY_LEGAL_NAME / COMPANY_NIT) para que se propague en textos legales y UI.
 */
export const COMPANY_NAME = "Molaryx";

/** Razón social formal. Vacío hasta constituir la empresa. */
export const COMPANY_LEGAL_NAME = "";

/** NIT u otro identificador tributario. Vacío hasta constituir la empresa. */
export const COMPANY_NIT = "";

export const COMPANY_SUPPORT_EMAIL = "kevinjp821@gmail.com";

export const COMPANY_COUNTRY = "Colombia";

export const COMPANY_DOMICILE = "Barranquilla, Atlántico, Colombia";

export const getCompanyLegalLabel = () => {
  if (COMPANY_LEGAL_NAME.trim() && COMPANY_NIT.trim()) {
    return `${COMPANY_LEGAL_NAME}, NIT ${COMPANY_NIT}`;
  }
  if (COMPANY_LEGAL_NAME.trim()) return COMPANY_LEGAL_NAME;
  return COMPANY_NAME;
};
