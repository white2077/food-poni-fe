const dev = process.env.NODE_ENV !== 'production';

export const REMEMBER_ME = 'rememberMe';

export const ACCESS_TOKEN = 'accessToken';

export const REFRESH_TOKEN = 'refreshToken';

export const HEADER_TOKEN = 'Authorization';

export const server = dev ? 'http://localhost:8080/api/v1' : 'https://production.server.com';