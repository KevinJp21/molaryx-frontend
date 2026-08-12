export type TBaseResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
    error?: string | null;
};

export type TPaginationResponse<T> ={
    items: T[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
}
