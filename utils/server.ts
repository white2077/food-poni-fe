const dev = process.env.NODE_ENV !== 'production';

export const REMEMBER_ME = 'rememberMe';

export const ACCESS_TOKEN = 'accessToken';

export const REFRESH_TOKEN = 'refreshToken';

export const HEADER_TOKEN = 'Authorization';

export const server = dev ? 'http://ip172-18-0-10-co96rn2im2rg009j99h0-8080.direct.labs.play-with-docker.com/api/v1' : 'https://production.server.com';