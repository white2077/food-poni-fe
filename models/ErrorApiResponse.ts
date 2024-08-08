export interface ErrorApiResponse {
    error: {
        code: string,
        details: string[];
        message: string;
    }
}