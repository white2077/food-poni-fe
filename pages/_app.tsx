import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Provider} from "react-redux";
import store from "../stores";
import {ConfigProvider} from "antd";
import nProgress from "nprogress";
import Router from "next/router";
import "nprogress/nprogress.css";
import {px2remTransformer, StyleProvider} from '@ant-design/cssinjs';
import {useEffect, useState} from "react";

nProgress.configure({showSpinner: false});
Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());

function MyApp({Component, pageProps}: AppProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (typeof window !== 'undefined') {
        window.onload = () => {
            document.getElementById('holderStyle')!.remove();
        };
    }

    return (
        <Provider store={store}>
            <ConfigProvider theme={{
                hashed: true,
                token: {
                    colorPrimary: '#F36F24',
                    borderRadius: '0.5rem',
                    screenSM: 640,
                    screenMD: 768,
                    screenLG: 1024,
                    screenXL: 1280,
                },
            }}>
                <style
                    id="holderStyle"
                    dangerouslySetInnerHTML={{
                        __html: `
                    *, *::before, *::after {
                        transition: none!important;
                    }
                    `,
                    }}
                />
                <div style={{visibility: !mounted ? 'hidden' : 'visible'}}>
                    <Component {...pageProps} />
                </div>
            </ConfigProvider>
        </Provider>
    );
}

export default MyApp;
