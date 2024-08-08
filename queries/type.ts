import {CookieValueTypes} from "cookies-next";

export type QueryPageType = {
    refreshToken?: CookieValueTypes
    page?: number,
    pageSize?: number,
    status?: boolean,
    sort?: string
};