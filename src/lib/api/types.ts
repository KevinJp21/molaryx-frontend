export interface ApiConfig {
    baseUrl?: string;
    defaultHeaders?: Record<string, string>;
    timeout?: number;
}

export interface AuthConfig {
    tokenProvider?: () => Promise<string | null> | string | null;
    tokenHeader?: string;
    tokenPrefix?: string;
}

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    headers: Headers;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: Response,
        public body?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}
