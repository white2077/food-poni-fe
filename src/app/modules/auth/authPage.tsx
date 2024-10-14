import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "@/app/modules/auth/components/login.tsx";
import Signup from "./components/signup";

const AuthPage = () => (
  <Routes>
    <Route path="login" element={<Login />} />
    <Route path="registration" element={<Login />} />
    <Route path="signup" element={<Signup />} />
    <Route path="registration" element={<Signup />} />
    <Route path="forgot-password" element={<Signup />} />
    <Route path="*" element={<Navigate to="/auth/login" />} />
    <Route path="*" element={<Navigate to="/auth/signup" />} />
  </Routes>
);

export { AuthPage };
