import store from "@/redux/store.ts";
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../styles/globals.scss";
import "./_metronic/assets/keenicons/duotone/style.css";
import "./_metronic/assets/keenicons/outline/style.css";
import "./_metronic/assets/keenicons/solid/style.css";
import { Error404 } from "./app/modules/errors/components/Error404";
import { HomePage } from "./components/pages/HomePage";
import { LoginPage } from "./components/pages/LoginPage";
import { OrderDetailPage } from "./components/pages/OrderDetailPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { SignupPage } from "./components/pages/SignupPage";
import { CheckoutPage } from "./components/pages/checkoutPage";
import { OrderPage } from "./components/pages/orderPage";
import { ProductCategoryPage } from "./components/pages/productCategoryPage";
import { AuthProvider } from "./authProvider";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  // {
  //   path: '/forgot-password',
  //   element: <ForgotPasswordPage />,
  // },
  // {
  //   path: '/otp',
  //   element: <OtpPage />,
  // },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/san-pham/:pathVariable",
    element: <ProductDetailPage />,
  },
  {
    path: "/danh-muc/:pathVariable",
    element: <ProductCategoryPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },

  // Private routes
  {
    path: "/quan-ly",
    errorElement: <Error404 />,
    children: [
      {
        path: "don-hang",
        element: <OrderPage />,
      },
      {
        path: "don-hang/:orderId",
        element: <OrderDetailPage />,
      },
    ],
  },
]);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: "#F36F24" } }}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ConfigProvider>
    </Provider>
  );
}
