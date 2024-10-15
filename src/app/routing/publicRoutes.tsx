import { lazy, ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "@/app/modules/auth";
import { ErrorsPage } from "@/app/modules/errors/ErrorsPage.tsx";
import HomeWrapper from "@/components/templates/homeWrapper.tsx";
import SuspensedView from "@/components/atoms/suspensedView.tsx";
import ProductCategory from "@/components/molecules/productCategory.tsx";
import { server } from "@/utils/server.ts";
import SidebarLayout from "@/components/sidebarLayout.tsx";
import CheckoutWrapper from "@/components/templates/checkoutWrapper";
import { DefaultLayout } from "@/components/defaultLayout";

const PublicRoute = () => {
  const ProductPage = lazy(() => import("@/components/pages/productPage.tsx"));
  
  const ProductCategoryPage = lazy(
    () => import("@/components/pages/productCategoryPage.tsx")
  );

  const sidebarContents: ReactNode[] = [
    <ProductCategory />,
    <img
      key={1}
      className="rounded-md w-full"
      src={server + "/upload/vertical-banner.png"}
      alt={""}
    />,
  ];

  return (
    <Routes>
      <Route element={<SidebarLayout sidebarContents={sidebarContents} />}>
        <Route index element={<HomeWrapper />} />
      </Route>
      <Route path="auth/*" element={<AuthPage />} />
      <Route
        path="san-pham/*"
        element={
          <SuspensedView>
            <ProductPage />
          </SuspensedView>
        }
      />

      <Route element={<DefaultLayout />}>
        <Route path="checkout" element={<CheckoutWrapper />} />
      </Route>

      <Route
        path="danh-muc/*"
        element={
          <SuspensedView>
            <ProductCategoryPage />
          </SuspensedView>
        }
      />
      <Route path="error/*" element={<ErrorsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export { PublicRoute };
