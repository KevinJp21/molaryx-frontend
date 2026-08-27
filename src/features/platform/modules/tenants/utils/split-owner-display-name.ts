/** Descompone el nombre completo del propietario (API) en partes editables. */
export const splitOwnerDisplayName = (fullName?: string | null) => {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return {
      firstName: "",
      secondName: null as string | null,
      firstSurname: "",
      secondSurname: null as string | null,
    };
  }

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      secondName: null,
      firstSurname: "",
      secondSurname: null,
    };
  }

  if (parts.length === 2) {
    return {
      firstName: parts[0],
      secondName: null,
      firstSurname: parts[1],
      secondSurname: null,
    };
  }

  if (parts.length === 3) {
    return {
      firstName: parts[0],
      secondName: null,
      firstSurname: parts[1],
      secondSurname: parts[2],
    };
  }

  return {
    firstName: parts[0],
    secondName: parts[1],
    firstSurname: parts[2],
    secondSurname: parts.slice(3).join(" "),
  };
};
