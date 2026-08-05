export type BaseResponse<T> = {
    message?: string;
    data?: T;
    errors?: string[];
}
