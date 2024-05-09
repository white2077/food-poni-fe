let accessToken: string = "";

export function setAccessToken(token: string) {
    accessToken = token;
}

export function getAccessToken(): string {
    return accessToken;
}