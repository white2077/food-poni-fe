import {CookieValueTypes, getCookie} from "cookies-next";

export const REMEMBER_ME: string = 'rememberMe';

export const ACCESS_TOKEN: string = 'accessToken';

export const REFRESH_TOKEN: string = 'refreshToken';

export const HEADER_TOKEN: string = 'Authorization';

export const server: string = process.env.NODE_ENV === 'production'
    ? 'https://production.server.com'
    : 'http://localhost:8080/api/v1';

export const refreshToken: CookieValueTypes = getCookie(REFRESH_TOKEN);