import {
  FileOutlined,
  UserOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider, { SiderTheme } from "antd/es/layout/Sider";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Link } from "react-router-dom";

export const SiderAdmin = ({ theme }: { theme: SiderTheme }) => (
  <Sider
    theme={theme}
    breakpoint="lg"
    collapsedWidth="0"
    onBreakpoint={(broken) => {
      console.log(broken);
    }}
    onCollapse={(collapsed, type) => {
      console.log(collapsed, type);
    }}
  >
    <div
      onClick={() => (window.location.href = "/")}
      className="flex items-center gap-1 nunito p-2 text-orange-400 cursor-pointer hover:text-orange-500"
    >
      <img
        src="/logo-02.png"
        className="w-10 h-10 md:w-14 md:h-14"
        alt="FoodPoni Logo"
      />
      <div className="text-2xl">FoodPoni</div>
    </div>
    <Menu
      theme={theme}
      mode="inline"
      defaultSelectedKeys={["/admin/dashboard"]}
      items={items}
    />
  </Sider>
);

const items: ItemType<MenuItemType>[] = [
  {
    key: "/admin/dashboard",
    icon: <UserOutlined />,
    label: <Link to="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: "/admin/file-management",
    icon: <FileOutlined />,
    label: <Link to="/admin/file-management">File Management</Link>,
  },
  {
    key: "/admin/order-management",
    icon: <VideoCameraOutlined />,
    label: "Order Management",
    children: [
      {
        key: "/admin/orders-realtime",
        icon: <VideoCameraOutlined />,
        label: <Link to="/admin/orders-realtime">Orders Realtime</Link>,
      },
      {
        key: "/admin/orders-table",
        icon: <VideoCameraOutlined />,
        label: <Link to="/admin/orders-table">Orders</Link>,
      },
    ],
  },
  {
    key: "/admin/product-management",
    icon: <VideoCameraOutlined />,
    label: "Order Management",
    children: [
      {
        key: "/admin/products-table",
        icon: <VideoCameraOutlined />,
        label: <Link to="/admin/products-table">Products</Link>,
      },
      {
        key: "/admin/product-categories-table",
        icon: <VideoCameraOutlined />,
        label: <Link to="/admin/product-categories-table">Product Categories</Link>,
      },
      {
        key: "/admin/toppings-table",
        icon: <VideoCameraOutlined />,
        label: <Link to="/admin/toppings-table">Toppings</Link>,
      },
    ],
  },
];
