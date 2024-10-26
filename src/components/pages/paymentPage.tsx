import { Route, Routes } from "react-router-dom";
import { DefaultLayout } from "../defaultLayout";
import { PaymentResult } from "@/components/templates/paymentSuccessWrapper.tsx";

export const PaymentPage = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      <Route path="/" element={<PaymentResult />} />
    </Route>
  </Routes>
);
