export const patientFullName = (...parts: Array<string | null | undefined>) =>
    parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
