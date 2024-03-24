const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:8080/api/v1' : 'https://production.server.com';