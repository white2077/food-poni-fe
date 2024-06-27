export interface ErrorApiResponse {
    error: {
        code: string,
        details: string[];
        message: string;
    }
}

export const INITIAL_ERROR_API_RESPONSE: ErrorApiResponse = {
    error: {
        code: '',
        details: [],
        message: ''
    }
}