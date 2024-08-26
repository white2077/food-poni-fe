import {CookieValueTypes} from "cookies-next";

export type QueryPageType = {
    refreshToken?: CookieValueTypes,
    page?: number,
    pageSize?: number,
    status?: boolean
};

export type QueryParams = {
    refreshToken?: CookieValueTypes;
    page?: number;
    pageSize?: number;
    status?: boolean | undefined;
    sort?: string[];
    // body?: z.infer<typeof productSchema>;
}