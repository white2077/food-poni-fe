import { LayoutProvider, LayoutSplashScreen } from "@/_metronic/layout/core";
import { fetchUserAction } from "@/redux/modules/auth.ts";
import { RootState } from "@/redux/store.ts";
import { REFRESH_TOKEN } from "@/utils/server.ts";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

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
  }, [dispatch, refresh_token]);

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
