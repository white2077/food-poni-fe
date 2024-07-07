export type Page<T> = {

    content: T,

    totalElements: number,

    totalPages: number,

    number: number,

    size: number,

    first: boolean,

    last: boolean,

}

export const INITIAL_PAGE_API_RESPONSE: Page<any> = {
    content: [],
    first: true,
    last: false,
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0
}