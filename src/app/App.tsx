import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  LayoutProvider,
  LayoutSplashScreen,
  MetronicSplashScreenProvider,
} from "@/_metronic/layout/core";
import Cookies from "js-cookie";
import { REFRESH_TOKEN } from "@/utils/server.ts";
import jwtDecode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAction } from "@/redux/modules/auth.ts";
import { RootState } from "@/redux/store.ts";

const App = () => {
  const dispatch = useDispatch();
  const { isFetchingUser } = useSelector((state: RootState) => state.auth);

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
  }, [dispatch]);

  if (refresh_token && isFetchingUser) return null;

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <LayoutProvider>
        <Outlet />
      </LayoutProvider>
    </Suspense>
  );
};

export { App };
