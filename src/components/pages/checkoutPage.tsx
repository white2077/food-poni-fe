import { Navigate, Route, Routes } from "react-router-dom";
import CheckoutWrapper from "@/components/templates/checkoutWrapper.tsx";
import {DefaultLayout} from "@/components/defaultLayout.tsx";

export default function checkoutPage() {
  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<CheckoutWrapper />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
