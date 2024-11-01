import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Checkbox, Col, Flex, Menu, Popover } from "antd";
import { AdminLayout } from "../templates/AdminLayout";

export const FileManagementPage = () => {
  return (
    <AdminLayout>
      <Flex gap="16px">
        <FileTree />
        <FileContent files="FIXME" />
      </Flex>
    </AdminLayout>
  );
};

export const FileTree = () => (
  <Col flex="200px">
    <Menu theme="light" mode="inline" defaultOpenKeys={["1"]} items={items} />
  </Col>
);

export const FileContent = (files: { files: string }) => (
  <Col flex="auto">
    <Flex wrap="wrap">
      <Popover content={"ehhehe"} placement="bottom">
        <div className="relative p-2 rounded-lg w-fit">
          <Checkbox
            checked={true}
            className="absolute top-0 right-0 z-50"
            value="A"
          />
          <img
            className="h-20 w-20 rounded-lg"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            onClick={() => {
              console.log(files);
            }}
          />
        </div>
      </Popover>
    </Flex>
  </Col>
);

const items = [
  {
    key: "1",
    icon: <MailOutlined />,
    label: "Navigation One",
    children: [
      { key: "11", label: "Option 1" },
      { key: "12", label: "Option 2" },
      { key: "13", label: "Option 3" },
      { key: "14", label: "Option 4" },
    ],
  },
  {
    key: "2",
    icon: <AppstoreOutlined />,
    label: "Navigation Two",
    children: [
      { key: "21", label: "Option 1" },
      { key: "22", label: "Option 2" },
      {
        key: "23",
        label: "Submenu",
        children: [
          { key: "231", label: "Option 1" },
          { key: "232", label: "Option 2" },
          { key: "233", label: "Option 3" },
        ],
      },
      {
        key: "24",
        label: "Submenu 2",
        children: [
          { key: "241", label: "Option 1" },
          { key: "242", label: "Option 2" },
          { key: "243", label: "Option 3" },
        ],
      },
    ],
  },
  {
    key: "3",
    icon: <SettingOutlined />,
    label: "Navigation Three",
    children: [
      { key: "31", label: "Option 1" },
      { key: "32", label: "Option 2" },
      { key: "33", label: "Option 3" },
      { key: "34", label: "Option 4" },
    ],
  },
];
