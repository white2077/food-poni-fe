import { router } from "@/main";
import { fetchUserAction } from "@/redux/modules/auth";
import { RootState } from "@/redux/store";
import { REFRESH_TOKEN } from "@/utils/server";
import { Button, Result } from "antd";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, RouterProvider } from "react-router-dom";
import { LoadingPage } from "./pages/LoadingPage";

export type CurrentUserNotNull = {
  readonly role: "RETAILER" | "CUSTOMER" | "VIP";
  readonly id: string;
  readonly avatar: string;
  readonly email: string;
  readonly addressId: string;
  readonly username: string;
};

export const App = () => {
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

  if (refresh_token && !currentUser) {
    return <LoadingPage  />;
  }
  return (
    <RouterProvider
      router={router(currentUser?.role as "RETAILER" | "CUSTOMER" | "VIP")}
    />
  );
};

export const SecuredRoute = ({
  children,
  currentRole,
  role,
}: {
  children: ReactNode;
  currentRole: "RETAILER" | "CUSTOMER" | "VIP";
  role: ("RETAILER" | "CUSTOMER" | "VIP")[];
}) => {
  if (role.includes(currentRole)) return <>{children}</>;
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};
