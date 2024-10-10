import { createRoot } from "react-dom/client";
import axios from "axios";
import { AuthProvider, setupAxios } from "./app/modules/auth";
import { Provider } from "react-redux";
import store from "@/redux/store.ts";
import "./_metronic/assets/keenicons/duotone/style.css";
import "./_metronic/assets/keenicons/outline/style.css";
import "./_metronic/assets/keenicons/solid/style.css";
import "../styles/globals.scss";
import { ConfigProvider } from "antd";
import { AppRoutes } from "@/app/routing/appRoutes.tsx";

setupAxios(axios);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <AuthProvider>
        <ConfigProvider theme={{ token: { colorPrimary: "#F36F24" } }}>
          <AppRoutes />
        </ConfigProvider>
      </AuthProvider>
    </Provider>,
  );
}
