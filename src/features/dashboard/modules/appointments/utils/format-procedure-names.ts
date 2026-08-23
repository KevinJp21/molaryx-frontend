export const formatProcedureNames = (
  procedures?: Array<{ name?: string | null }> | null,
  fallback = "Cita",
) => {
  const names = (procedures ?? [])
    .map((procedure) => procedure.name?.trim())
    .filter((name): name is string => Boolean(name));

  return names.length > 0 ? names.join(", ") : fallback;
};
