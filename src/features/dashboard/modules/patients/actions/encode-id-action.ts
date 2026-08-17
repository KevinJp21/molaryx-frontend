"use server";

import { encodeId } from "@/utils/code-and-decode-id";

export const apiEncodeIdAction = async (id: number): Promise<string> =>
  encodeId(id);
