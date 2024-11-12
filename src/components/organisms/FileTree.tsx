import { Col, Menu } from "antd";
import { FolderOutlined } from "@ant-design/icons";

export const FileTree = () => (
  <Col flex="200px">
    <Menu
      theme="light"
      mode="inline"
      defaultOpenKeys={["1"]}
      items={[
        {
          key: "1",
          icon: <FolderOutlined />,
          label: "/public",
        },
        {
          key: "2",
          icon: <FolderOutlined />,
          label: "/folder-01",
        },
      ]}
    />
  </Col>
);
