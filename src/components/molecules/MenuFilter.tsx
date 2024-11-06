import { fetchProductsAction } from "@/redux/modules/product.ts";
import { CrownOutlined, StarOutlined, TagOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { useDispatch } from "react-redux";

export default function MenuFilter() {
  const dispatch = useDispatch();

  return (
    <Menu
      className="block rounded-lg"
      onSelect={({ key }: { key: string }) => {
        let sortOption = [""];
        switch (key) {
          case "bestnews":
            sortOption = ["updatedAt,desc"];
            break;
          case "bestsellers":
            sortOption = ["sales,desc"];
            break;
          case "toprates":
            sortOption = ["rate,desc"];
            break;
          default:
            return;
        }
        dispatch(
          fetchProductsAction({
            queryParams: { page: 0, pageSize: 10, sort: sortOption },
          }),
        );
      }}
      defaultSelectedKeys={["bestsellers"]}
      mode="horizontal"
      items={[
        {
          label: "Bán chạy nhất",
          key: "bestsellers",
          icon: <CrownOutlined />,
        },
        {
          label: "Mới nhất",
          key: "bestnews",
          icon: <TagOutlined />,
        },
        {
          label: "Đánh giá hàng đầu",
          key: "toprates",
          icon: <StarOutlined />,
        },
      ]}
    />
  );
}
