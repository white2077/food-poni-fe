import { Navigate, Route, Routes } from "react-router-dom";
import {LoginWrapper} from "@/components/templates/loginWrapper.tsx";

const AuthPage = () => (
  <Routes>
    <Route path="login" element={<LoginWrapper />} />
    <Route path="registration" element={<LoginWrapper />} />
    <Route path="forgot-password" element={<LoginWrapper />} />
    <Route path="*" element={<Navigate to="/auth/login" />} />
  </Routes>
);

export { AuthPage };
