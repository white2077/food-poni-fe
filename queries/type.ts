import {CookieValueTypes} from "cookies-next";

export type queryPageType = {
    page?: number,
    pageSize?: number,
    status?: boolean,
    sort?: string
};

export type getAllType = queryPageType & {refreshToken: CookieValueTypes};