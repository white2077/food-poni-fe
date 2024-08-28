import {NextRequest, NextResponse} from "next/server";
import {REFRESH_TOKEN} from "./utils/server";

export function middleware(request: NextRequest) {
    const refreshToken = request.cookies.get(REFRESH_TOKEN);
    if (!refreshToken) {
        request.nextUrl.pathname = "/login";
        return NextResponse.redirect(request.nextUrl);
    }
}

export const config = {
    matcher: [
        '/account-information',
        '/checkout',
        '/order/[oid]',
        '/orders',
    ],
}