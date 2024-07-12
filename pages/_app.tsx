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
                    colorSuccess: '#43A047',
                    colorWarning: '#FFB74D',
                    colorDanger: '#F44336',
                    colorInfo: '#2196F3',
                    colorLight: '#F5F5F5',
                    colorDark: '#212121',
                    colorTextPrimary: '#212121',
                    colorTextSecondary: '#757575',
                    colorTextDisabled: '#BDBDBD',
                    colorTextLink: '#03A9F4',
                    borderRadius: 8,
                    screenSM: 640,
                    screenMD: 768,
                    screenLG: 1024,
                    screenXL: 1280,
                },
            }}>
                <Component {...pageProps} />
            </ConfigProvider>
        </Provider>
    );
}

export default MyApp;
