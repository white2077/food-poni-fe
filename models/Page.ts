export type Page<T> = {
    content: T;
    empty: boolean;
    first: boolean
    last: boolean
    number: number
    numberOfElements: number
    size: number
    totalElements: number
    totalPages: number
}

export const INITIAL_PAGE_API_RESPONSE: Page<any> = {
    content: [],
    empty: true,
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
}