import store from "@/redux/store.ts";
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, Navigate } from "react-router-dom";
import "../styles/globals.scss";
import { App, SecuredRoute } from "./components/App";
import { AccountInformationPage } from "./components/pages/AccountInformationPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { DashboardPage } from "./components/pages/Dashboard";
import { FileManagementPage } from "./components/pages/FileManagementPage";
import { HomePage } from "./components/pages/HomePage";
import { LoginPage } from "./components/pages/LoginPage";
import { OrderDetailPage } from "./components/pages/OrderDetailPage";
import { OrderPage } from "./components/pages/OrderPage";
import { ProductCategoryPage } from "./components/pages/ProductCategoryPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { SignupPage } from "./components/pages/SignupPage";
import { OrderGroupPage } from "./components/pages/OrderGroupPage";
import { OrderGroupDetailPage } from "./components/pages/OrderGroupDetailPage";
import { OrderPostPaidDetailPage } from "./components/pages/OrderPostPaidDetailPage";
import { AdminOrderTablePage } from "./components/pages/AdminOrderTablePage";
import { AdminProductTablePage } from "./components/pages/AdminProductTablePage";
import { AdminProductDetailTablePage } from "./components/pages/AdminProductDetailTablePage";
import { ConsolidatedInvoicePage } from "./components/pages/ConsolidatedInvoicePage";
import { PostPaidDetailPage } from "./components/pages/PostPaidDetailPage";
import { SupportPage } from "./components/pages/SupportPage";

export const router = (currentRole: "RETAILER" | "CUSTOMER" | "VIP") =>
  createBrowserRouter([
    // Shop routes
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
      path: "/ho-tro-khach-hang",
      element: <SupportPage />,
    },
    {
      path: "/danh-muc/:pathVariable",
      element: <ProductCategoryPage />,
    },
    {
      path: "/checkout",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <CheckoutPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/don-hang",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <OrderPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/don-hang/:orderId",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <OrderDetailPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/thong-tin-tai-khoan",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <AccountInformationPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/don-hang-nhom",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <OrderGroupPage />
        </SecuredRoute>
      ),
    },

    {
      path: "don-hang-nhom/:orderId",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <OrderGroupDetailPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/ghi-no",
      element: (
        <SecuredRoute currentRole={currentRole} role={["VIP"]}>
          <ConsolidatedInvoicePage />
        </SecuredRoute>
      ),
    },
    {
      path: "ghi-no/:orderId",
      element: (
        <SecuredRoute currentRole={currentRole} role={["VIP"]}>
          <PostPaidDetailPage />
        </SecuredRoute>
      ),
    },
    {
      path: "ghi-no/don-hang/:orderId",
      element: (
        <SecuredRoute currentRole={currentRole} role={["VIP"]}>
          <OrderPostPaidDetailPage />
        </SecuredRoute>
      ),
    },

    // Admin routes
    {
      path: "/admin",
      children: [
        {
          index: true,
          element: <Navigate to="/admin/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <DashboardPage />
            </SecuredRoute>
          ),
        },
        {
          path: "file-management",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <FileManagementPage />
            </SecuredRoute>
          ),
        },
        {
          path: "orders-realtime",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <div>Orders Realtime</div>
            </SecuredRoute>
          ),
        },
        {
          path: "orders-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminOrderTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "products-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminProductTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "product-details/:pid",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminProductDetailTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "product-categories-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <div>Product Categories</div>
            </SecuredRoute>
          ),
        },
        {
          path: "toppings-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <div>Topping</div>
            </SecuredRoute>
          ),
        },
      ],
    },
  ]);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: "#F36F24" } }}>
        <App />
      </ConfigProvider>
    </Provider>
  );
}
