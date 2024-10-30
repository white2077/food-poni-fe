import store from "@/redux/store.ts";
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../styles/globals.scss";
import { AuthProvider } from "./components/AuthProvider";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { HomePage } from "./components/pages/HomePage";
import { LoginPage } from "./components/pages/LoginPage";
import { OrderDetailPage } from "./components/pages/OrderDetailPage";
import { OrderPage } from "./components/pages/OrderPage";
import { ProductCategoryPage } from "./components/pages/ProductCategoryPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { ProductTablePage } from "./components/pages/ProductTablePage";
import { SignupPage } from "./components/pages/SignupPage";

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
    errorElement: <div>error</div>,
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
  {
    path: "/admin",
    children: [
      {
        path: "dashboard",
        element: <OrderPage />,
      },
      {
        path: "file-manager",
        element: <div>File Manager</div>,
      },
      {
        path: "orders-realtime",
        element: <div>Orders Realtime</div>,
      },
      {
        path: "orders-table",
        element: <div>Orders</div>,
      },
      {
        path: "products-table",
        element: <ProductTablePage />,
      },
      {
        path: "product-categories-table",
        element: <div>Product Categories</div>,
      },
      {
        path: "toppings-table",
        element: <div>Topping</div>,
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
