import { cookies } from "next/headers";
import { AUTH_TOKEN } from "@/consts";
import { ApiClient } from "./core";
import { getObfuscatedCookieName } from "@/utils";

// Server-side token provider (for SSR)
const getServerToken = async (): Promise<string | null> => {
    const cookieStore = await cookies();
    const obfuscatedCookieName = getObfuscatedCookieName(AUTH_TOKEN);
    return cookieStore.get(obfuscatedCookieName)?.value ?? null;
};

export const serverApi = new ApiClient(
    {
        baseUrl: `${process.env.URL}${process.env.URN}` || 'http://localhost:3000',
    },
    {
        tokenProvider: getServerToken,
    }
);
