export interface ErrorAPIResponse {
    error: {
        code: string,
        details: string[];
        message: string;
    }
}