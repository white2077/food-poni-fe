import {Suspense, useEffect} from 'react'
import {Outlet} from 'react-router-dom'
import {LayoutProvider, LayoutSplashScreen} from '@/_metronic/layout/core'
import {AuthInit} from './modules/auth'
import Cookies from "js-cookie";
import {REFRESH_TOKEN} from "@/utils/server.ts";
import jwtDecode from "jwt-decode";
import {useDispatch} from "react-redux";
import {updateCurrentUser} from "@/redux/modules/auth.ts";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const refresh_token = Cookies.get(REFRESH_TOKEN);
        if (refresh_token) {
            const payload: {
                readonly role: string,
                readonly id: string,
                readonly avatar: string,
                readonly email: string,
                readonly addressId: string,
                readonly username: string
            } = jwtDecode(refresh_token);
            dispatch(updateCurrentUser(payload));
        }
    }, [dispatch]);

    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <LayoutProvider>
                <AuthInit>
                    <Outlet/>
                </AuthInit>
            </LayoutProvider>
        </Suspense>
    )
}

export {App}
