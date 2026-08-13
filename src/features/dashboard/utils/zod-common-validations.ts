import { NAME_REGEX } from "@/consts";
import { z } from "zod";

export const zodOptionalName = (message: string) =>
  z
    .string()
    .nullable()
    .refine(
      (value) =>
        value == null || value.trim() === "" || NAME_REGEX.test(value.trim()),
      { message },
    );
