import { Navigate, Route, Routes } from "react-router-dom";
import SuspensedView from "@/components/atoms/suspensedView.tsx";
import { lazy } from "react";
import ManagementLayout from "@/components/templates/ManagementLayout";

const PrivateRoutes = () => {
  const OrderPage = lazy(() => import("@/components/pages/orderPage.tsx"));
  const AccountInformation = lazy(
    () => import("@/components/templates/accountInformation.tsx"),
  );

  return (
    <Routes>
      <Route element={<ManagementLayout />}>
        <Route path="auth/*" element={<Navigate to="/" />} />
        {/* Pages */}
        {/*<Route path='dashboard' element={<DashboardWrapper />} />*/}
        {/* Lazy Modules */}
        <Route
          path="thong-tin-tai-khoan"
          element={
            <SuspensedView>
              <AccountInformation />
            </SuspensedView>
          }
        />
        <Route
          path="don-hang/*"
          element={
            <SuspensedView>
              <OrderPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/error/404" />} />
      </Route>
    </Routes>
  );
};

export { PrivateRoutes };
