import {
  AppstoreOutlined,
  CrownOutlined,
  DollarOutlined,
  StarOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

interface MainMenuProps {
  filterProducts: (key: string) => void;
}

export default function MenuShop({ filterProducts }: MainMenuProps) {
  return (
    <Menu
      className="block rounded-lg"
      onSelect={({ key }: { key: string }) => filterProducts(key)}
      defaultSelectedKeys={["all"]}
      mode="horizontal"
      items={items}
    />
  );
}

const items: MenuProps["items"] = [
  {
    label: "Tất cả",
    key: "all",
    icon: <AppstoreOutlined />,
  },
  {
    label: "Khuyến mãi",
    key: "promotion",
    icon: <DollarOutlined />,
  },
  {
    label: "Mới nhất",
    key: "bestnews",
    icon: <TagOutlined />,
  },
  {
    label: "Bán chạy nhất",
    key: "bestsellers",
    icon: <CrownOutlined />,
  },
  {
    label: "Đánh giá hàng đầu",
    key: "toprates",
    icon: <StarOutlined />,
  },
];
