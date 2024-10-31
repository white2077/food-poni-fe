import { fetchUserAction } from "@/redux/modules/auth";
import { RootState } from "@/redux/store";
import { REFRESH_TOKEN } from "@/utils/server";
import jwtDecode from "jwt-decode";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductLoading } from "./atoms/ProductLoading";
import Cookies from "js-cookie";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const refresh_token = Cookies.get(REFRESH_TOKEN);

  useEffect(() => {
    if (refresh_token) {
      const payload: {
        readonly role: string;
        readonly id: string;
        readonly avatar: string;
        readonly email: string;
        readonly addressId: string;
        readonly username: string;
      } = jwtDecode(refresh_token);
      dispatch(fetchUserAction({ uid: payload.id }));
    }
  }, [dispatch, refresh_token]);

  if (refresh_token && !currentUser) return <ProductLoading />;

  return <>{children}</>;
};
