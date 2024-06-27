import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Provider} from "react-redux";
import store from "../stores";
import {ConfigProvider} from "antd";
import nProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";

nProgress.configure({showSpinner: false});
Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());

function MyApp({Component, pageProps}: AppProps) {
    return (
        <Provider store={store}>
            <ConfigProvider theme={{
                hashed: true,
                token: {
                    colorPrimary: '#F36F24',
                },
            }}>
                <Component {...pageProps} />
            </ConfigProvider>
        </Provider>
    );
}

export default MyApp;
