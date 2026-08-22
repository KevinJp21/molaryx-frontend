import { ApiConfig, AuthConfig, ApiResponse, ApiError } from "./types";

export class ApiClient {
    private config: Required<ApiConfig>;
    private authConfig: AuthConfig;

    constructor(config: ApiConfig = {}, authConfig: AuthConfig = {}) {
        this.config = {
            baseUrl: config.baseUrl || '',
            defaultHeaders: {
                'Content-Type': 'application/json',
                ...config.defaultHeaders,
            },
            timeout: config.timeout || 60000,
        };

        // Auth config
        this.authConfig = {
            tokenHeader: 'Authorization',
            tokenPrefix: 'Bearer',
            ...authConfig,
        };
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = this.buildUrl(endpoint);
        const requestOptions = await this.buildRequestOptions(options);

        try {
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

            const response = await fetch(url, {
                ...requestOptions,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorBody = await this.parseErrorBody(response);
                throw new ApiError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    response,
                    errorBody,
                );
            }

            // Parse JSON safely
            const data = await this.parseResponse<T>(response);

            return {
                data,
                status: response.status,
                headers: response.headers,
            };

        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new ApiError('Request timeout', 408);
            }
            throw error;
        }
    }

    private buildUrl(endpoint: string): string {
        // Handle both absolute and relative URLs
        if (endpoint.startsWith('http')) {
            return endpoint;
        }
        return `${this.config.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    }

    private async buildRequestOptions(options: RequestInit): Promise<RequestInit> {

        const headers: any = { ...this.config.defaultHeaders };

        // Remove Content-Type for FormData to let browser/fetch handle boundary
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        // Add authentication token if available
        if (this.authConfig.tokenProvider) {
            const token = await this.authConfig.tokenProvider();
            if (token) {
                headers[this.authConfig.tokenHeader!] =
                    `${this.authConfig.tokenPrefix} ${token}`;
            }
        }
        return {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        };
    }

    private async parseErrorBody(response: Response): Promise<unknown> {
        const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';

        try {
            if (contentType.includes('json')) {
                return await response.json();
            }
            const text = await response.text();
            return text.trim() ? text : null;
        } catch {
            return null;
        }
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
            try {
                return await response.json();
            } catch (error) {
                throw new ApiError('Invalid JSON response', response.status, response);
            }
        }

        if (
            contentType?.includes('application/pdf') ||
            contentType?.includes('image/') ||
            contentType?.includes('application/octet-stream') ||
            contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
            contentType?.includes('application/vnd.ms-excel') ||
            contentType?.includes('text/csv')
        ) {
            return (await response.blob()) as unknown as T;
        }

        // Handle text responses
        return (await response.text()) as unknown as T;
    }

    async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        const isFormData = data instanceof FormData;
        return this.makeRequest<T>(endpoint, {
            ...options,
            method: 'POST',
            body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
        });
    }

    async put<T>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        const isFormData = data instanceof FormData;
        return this.makeRequest<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
        });
    }

    async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
    }

    async patch<T>(
        endpoint: string,
        data?: any,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        const isFormData = data instanceof FormData;
        return this.makeRequest<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
        });
    }
}
