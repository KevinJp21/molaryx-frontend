export const fullName = (...parts: Array<string | null | undefined>) =>
  parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
