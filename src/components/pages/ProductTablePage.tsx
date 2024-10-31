import { fetchProductsAction } from "@/redux/modules/product";
import { RootState } from "@/redux/store";
import { getThumbnail } from "@/utils/common";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  ImportOutlined,
  LoginOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Flex,
  Popconfirm,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { AdminLayout } from "../templates/AdminLayout";
const { useToken } = theme;

const TableToolbar = ({
  isFetchLoading,
  selectedRowKeys,
}: {
  isFetchLoading: boolean;
  selectedRowKeys: Array<React.Key>;
}) => (
  <Flex className="mb-4" justify="space-between">
    <Col>
      {selectedRowKeys.length > 0 && (
        <Popconfirm title="Are you sure you want to delete these items?">
          <Button
            className="bg-red-500 text-white"
            type="default"
            icon={<CloseCircleOutlined />}
            style={{ marginRight: "10px" }}
            disabled={isFetchLoading}
          >
            Delete All
            <Badge
              className="absolute -top-3 -right-2"
              count={selectedRowKeys.length}
            />
          </Button>
        </Popconfirm>
      )}
    </Col>
    <Col>
      <Button
        type="default"
        icon={<DownloadOutlined />}
        style={{ marginRight: "10px" }}
      >
        Download
      </Button>
      <Button
        type="default"
        icon={<ImportOutlined />}
        style={{ marginRight: "10px" }}
      >
        Import
      </Button>

      <Button
        type="primary"
        icon={<PlusCircleOutlined />}
        style={{ marginRight: "10px" }}
      >
        Add New
      </Button>
    </Col>
  </Flex>
);

export const ProductTablePage = () => {
  const dispatch = useDispatch();
  const { token } = useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.product
  );

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
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Inactive",
          value: false,
        },
      ],
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ];

  useEffect(() => {
    dispatch(
      fetchProductsAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: "createdDate,desc",
        },
      })
    );
  }, [dispatch]);

  return (
    <AdminLayout>
      <TableToolbar
        isFetchLoading={isFetchLoading}
        selectedRowKeys={selectedRowKeys}
      />
      <Table
        onChange={onChange}
        pagination={{
          total: page.totalElements,
          pageSize: page.size,
          current: page.number + 1,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `Total ${total} items`,
          size: "default",
        }}
        loading={isFetchLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) =>
            setSelectedRowKeys(newSelectedRowKeys),
        }}
        columns={columns}
        dataSource={page.content.map((it, index) => ({
          ...it,
          key: it.id,
          no: page.number * page.size + index + 1,
          name: (
            <AvatarInfo
              fullName={it.name}
              avatar={getThumbnail(it.thumbnail)}
              info={`/${it.slug}`}
            />
          ),
          categories: [""].join(", "),
          createdAt: it.createdDate.toLocaleString(),
          status: (
            <Tag
              icon={
                it.status ? <CheckCircleOutlined /> : <CloseCircleOutlined />
              }
              color={it.status ? "success" : "error"}
            >
              {it.status ? "Active" : "Inactive"}
            </Tag>
          ),
          actions: (
            <Dropdown
              trigger={["click"]}
              placement="bottomLeft"
              arrow={{ pointAtCenter: true }}
              menu={{
                items: tableRowActions.map((item) => ({
                  ...item,
                  label: (
                    <Link to={`/admin/product-details/${it.id}`}>
                      {item.label}
                    </Link>
                  ),
                })),
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

const tableRowActions = [
  {
    key: "1",
    icon: <EditOutlined />,
    label: "Edit",
  },
  {
    key: "2",
    icon: <CopyOutlined />,
    label: "Copy ID",
  },
  {
    key: "3",
    icon: <EyeOutlined />,
    label: "Preview Card",
  },
];

const onChange: TableProps["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
};
