import SearchKeyword from "@/components/searchKeyword.tsx";
import MenuMobile from "@/components/menu-mobile.tsx";
import { UserDropdown } from "@/components/molecules/userDropdown.tsx";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store.ts";
import Cart from "@/components/organisms/cart.tsx";
import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "@/components/organisms/notificationDropdown.tsx";

// let sock: WebSocket | null = null;
export default function HeaderMain() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] px-2 mx-auto items-center py-2 gap-4 max-w-screen-xl">
      <div className="flex items-center justify-between md:justify-start">
        <MenuMobile />

        <div
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-1 nunito text-3xl md:text-4xl text-orange-400 cursor-pointer hover:text-orange-500"
        >
          <img
            src="/logo-02.png"
            className="w-10 h-10 md:w-14 md:h-14"
            alt="FoodPoni Logo"
          />
          <div className="md:block">FoodPoni</div>
        </div>

        <Button
          className="block sm:hidden"
          type="primary"
          onClick={() => navigate("/auth/login")}
          icon={<UserOutlined />}
          size="large"
        >
          <span className=" md:inline">Đăng nhập</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 grid-cols-[2fr_1fr] items-center gap-4">
        <div className="order-1 md:order-2 mt-4 md:mt-0">
          <SearchKeyword />
        </div>
        <div className="order-2 hidden md:block text-end">
          {currentUser ? (
            <div className="flex items-center justify-end gap-4 order-2 md:order-3">
              <Cart />
              <NotificationDropdown />
              <UserDropdown />
            </div>
          ) : (
            <Button
              type="primary"
              onClick={() => navigate("/auth/login")}
              icon={<UserOutlined />}
              size="large"
            >
              <span className="">Đăng nhập</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
