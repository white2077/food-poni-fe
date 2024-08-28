import {CookieValueTypes} from "cookies-next";

export type QueryParams = {
    refreshToken?: CookieValueTypes;
    page?: number;
    pageSize?: number;
    status?: boolean | undefined;
    sort?: string[];
    // body?: z.infer<typeof productSchema>;
}