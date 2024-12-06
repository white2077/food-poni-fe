export const REMEMBER_ME: string = "rememberMe";

export const ACCESS_TOKEN: string = "accessToken";

export const REFRESH_TOKEN: string = "refreshToken";

export const HEADER_TOKEN: string = "Authorization";

export const server: string =
  process.env.NODE_ENV === "production"
    ? "https://curly-space-dollop-p9w4vv6547ph6pgr-8080.app.github.dev"
    : // : 'http://34.92.177.122:8080';
      "https://curly-space-dollop-p9w4vv6547ph6pgr-8080.app.github.dev";
