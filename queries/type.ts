import {CookieValueTypes} from "cookies-next";

export type queryPageType = {
    page?: number,
    pageSize?: number,
    status?: boolean
};

export type getAllType = queryPageType & {refreshToken: CookieValueTypes};