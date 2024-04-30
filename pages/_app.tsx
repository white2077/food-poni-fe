import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Provider} from "react-redux";
import store from "../stores";
import {ConfigProvider} from "antd";

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
