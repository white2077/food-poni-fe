import { Navigate, Route, Routes } from "react-router-dom";
import SignupWrapper from "@/components/templates/signupWrapper.tsx";
import {LoginWrapper} from "@/components/templates/loginWrapper.tsx";

const AuthPage = () => (
  <Routes>
    <Route path="login" element={<LoginWrapper />} />
    <Route path="signup" element={<SignupWrapper />} />
    {/*<Route path="forgot-password" element={<Signup />} />*/}
    <Route path="*" element={<Navigate to="/auth/login" />} />
    <Route path="*" element={<Navigate to="/auth/signup" />} />
  </Routes>
);

export { AuthPage };
