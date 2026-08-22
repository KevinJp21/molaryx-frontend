import { AUTH_TOKEN } from "@/consts";
import { ApiClient } from "./core";

// Client-side token provider (browser only)
const getClientToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN);
};

export const clientApi = new ApiClient(
    {
        baseUrl: `${process.env.URL}${process.env.URN}` || 'http://localhost:3000',
    },
    {
        tokenProvider: getClientToken,
    }
);
