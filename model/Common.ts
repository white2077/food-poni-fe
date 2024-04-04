export type Page<T> = {
    content: T,
    totalElements: number,
    totalPages: number,
    number: number,
    size: number,
    first: boolean,
}

export const INITIAL_PAGE = {content: [], totalElements: 0, totalPages: 0, number: 0, size: 0, first: true};