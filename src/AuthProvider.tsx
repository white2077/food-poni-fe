import { ReactNode, useEffect } from "react";
import { REFRESH_TOKEN } from "./utils/server";
import jwtDecode from "jwt-decode";
import { fetchUserAction } from "./redux/modules/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Cookies from "js-cookie";
import { ProductLoading } from "./components/atoms/productLoading";

const useDispatchProps = () => {
  const dispatch = useDispatch();

  const getCurentUser = (id: string) => dispatch(fetchUserAction({ uid: id }));

  return { getCurentUser };
};

const useSelectorProps = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return { currentUser };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getCurentUser } = useDispatchProps();
  const { currentUser } = useSelectorProps();

  useEffect(() => {
    const refresh_token = Cookies.get(REFRESH_TOKEN);

    if (refresh_token) {
      const payload: {
        readonly role: string;
        readonly id: string;
        readonly avatar: string;
        readonly email: string;
        readonly addressId: string;
        readonly username: string;
      } = jwtDecode(refresh_token);
      getCurentUser(payload.id);
    }
  }, []);

  if (!currentUser) return <ProductLoading />;

  return <>{children}</>;
};
