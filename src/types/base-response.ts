export type BaseResponse<T> = {
    ok: boolean;
    message: string;
    data: T | null;
    errors?: Record<string, string[]> | null;
};
