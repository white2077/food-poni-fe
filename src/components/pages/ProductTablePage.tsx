import { getThumbnail } from "@/utils/common";
import { DeleteOutlined, EditOutlined, LoginOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Dropdown,
  Popconfirm,
  Table,
  TableColumnsType,
  theme,
} from "antd";
import React, { useState } from "react";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { AdminLayout } from "../templates/AdminLayout";
const { useToken } = theme;

type ProductState = {
  id: string;
  thumbnail: string;
  name: string;
  categories: Array<string>;
  createdAt: Date;
  status: string;
};

export const ProductTablePage = () => {
  const { token } = useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  return (
    <AdminLayout>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) =>
            setSelectedRowKeys(newSelectedRowKeys),
        }}
        columns={columns}
        dataSource={data.map((it, index) => ({
          ...it,
          key: it.id,
          no: index + 1,
          name: (
            <AvatarInfo
              fullName={it.name}
              avatar={getThumbnail(it.thumbnail)}
              info={it.id}
            />
          ),
          categories: it.categories.join(", "),
          createdAt: it.createdAt.toLocaleString(),
          status: it.status === "true" ? "Active" : "Inactive",
          actions: (
            <Dropdown
              trigger={["click"]}
              menu={{
                items: [
                  {
                    key: "1",
                    icon: <EditOutlined />,
                    label: "Edit",
                  },
                  {
                    key: "2",
                    icon: <EditOutlined />,
                    label: "Copy ID",
                  },
                  {
                    key: "3",
                    icon: <EditOutlined />,
                    label: "View Details",
                  },
                ],
              }}
              dropdownRender={(menu) => (
                <div
                  style={{
                    backgroundColor: token.colorBgElevated,
                    borderRadius: token.borderRadiusLG,
                    boxShadow: token.boxShadowSecondary,
                  }}
                >
                  {React.cloneElement(menu as React.ReactElement, {
                    style: {
                      boxShadow: "none",
                    },
                  })}
                  <Divider style={{ margin: 0 }} />
                  <div style={{ padding: 8 }}>
                    <Popconfirm title="Sure to delete?" onConfirm={() => {}}>
                      <Button className="w-full justify-start" type="primary">
                        <DeleteOutlined />
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              )}
              placement="bottomLeft"
              arrow={{ pointAtCenter: true }}
            >
              <LoginOutlined />
            </Dropdown>
          ),
        }))}
        size="small"
      />
    </AdminLayout>
  );
};

const columns: TableColumnsType = [
  {
    title: "No.",
    dataIndex: "no",
  },
  {
    title: "__________Name",
    dataIndex: "name",
  },
  {
    title: "Categories",
    dataIndex: "categories",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
  },
  {
    title: "Status",
    dataIndex: "status",
  },
  {
    title: "Actions",
    dataIndex: "actions",
  },
];

const data: Array<ProductState> = [
  {
    id: "1",
    thumbnail: "/no-avatar.png",
    name: "John Brown",
    categories: ["A", "B"],
    createdAt: new Date(),
    status: "true",
  },
  {
    id: "2",
    thumbnail: "/no-avatar.png",
    name: "Jim Green",
    categories: ["A", "B"],
    createdAt: new Date(),
    status: "true",
  },
  {
    id: "3",
    thumbnail: "/no-avatar.png",
    name: "Joe Black",
    categories: ["A", "B"],
    createdAt: new Date(),
    status: "true",
  },
];
