import { RootState } from "@/redux/store.ts";
import { getThumbnail } from "@/utils/common";
import { REFRESH_TOKEN } from "@/utils/server.ts";
import {
  LogoutOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function UserDropdown() {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();

  const items = [
    {
      key: "1",
      label: (
        <span
          onClick={(): void => {
            navigate("/thong-tin-tai-khoan");
          }}
          className="flex w-full h-full"
        >
          <span style={{ marginRight: "5px" }}>
            <UserOutlined />
          </span>
          <div className="w-full">Thông tin tài khoản</div>
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span
          onClick={() => navigate("/don-hang")}
          className="flex w-full h-full"
        >
          <span style={{ marginRight: "5px" }}>
            <ShoppingOutlined />
          </span>
          <div className="w-full">Đơn hàng của bạn</div>
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span onClick={() => "/"} className="flex w-full h-full">
          <span style={{ marginRight: "5px" }}>
            <QuestionCircleOutlined />
          </span>
          <div className="w-full">Trung tâm hỗ trợ</div>
        </span>
      ),
    },
    {
      key: "4",
      label: (
        <span
          onClick={() => {
            Cookies.remove(REFRESH_TOKEN);
            navigate("/");
            window.location.reload();
          }}
          className="flex w-full h-full"
        >
          <span className="mr-4">
            <LogoutOutlined />
          </span>
          <div className="w-full">Đăng xuất</div>
        </span>
      ),
    },
  ];

  if (!currentUser) return;

  return (
    <Dropdown
      menu={{
        items: items.map((it) => {
          if (it.key === "2" && currentUser.role === "RETAILER") return null;
          return it;
        }),
      }}
      placement="bottomRight"
      trigger={["click"]}
      className="hover:bg-gray-200 rounded-lg p-1.5 cursor-pointer h-[100%] "
    >
      <a className="gap-1 flex items-center">
        {currentUser.avatar ? (
          <Avatar
            className="w-8 h-8 rounded-[100%] border-orange-400 border-2 p-0"
            src={getThumbnail(currentUser.avatar)}
          />
        ) : (
          <Avatar icon={<UserOutlined />} />
        )}
        <span className="text-gray-500 text-[15px] hidden md:block">
          {currentUser.username}
        </span>
      </a>
    </Dropdown>
  );
}
