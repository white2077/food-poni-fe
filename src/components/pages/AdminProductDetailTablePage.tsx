import { useParams } from "react-router-dom";
import { fetchProductAction } from "@/redux/modules/product";
import { RootState } from "@/redux/store";
import { currencyFormat } from "@/utils/common";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DashOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  ImportOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  Flex,
  Popconfirm,
  Rate,
  Table,
  TableColumnsType,
  Tag,
  Divider,
  theme,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdminLayout } from "../templates/AdminLayout";
import { ProductDetailModalEdit } from "../organisms/ProductDetailModalEdit";
import { ProductDetailModalCreate } from "../organisms/ProductDetailModalCreate";
import { AvatarsInfo } from "../atoms/AvatarsInfo";
import {
  deleteProductDetailAction,
  fetchProductDetailAction,
  updateProductDetailStatusAction,
} from "@/redux/modules/productDetail";
import { format } from "date-fns";
const { useToken } = theme;

const TableToolbar = ({
  isFetchLoading,
  isUpdateLoading,
  selectedRowKeys,
  onDeleteAll,
  productName,
}: {
  isFetchLoading: boolean;
  isUpdateLoading: boolean;
  selectedRowKeys: Array<React.Key>;
  onDeleteAll: () => void;
  productName: string;
}) => (
  <Flex className="mb-4" justify="space-between">
    <Col>
      {selectedRowKeys.length > 0 ? (
        <Popconfirm
          title="Delete selected items?"
          description="This action cannot be undone."
          onConfirm={onDeleteAll}
          disabled={isUpdateLoading}
        >
          <Button
            className="bg-red-500 text-white"
            type="default"
            icon={<CloseCircleOutlined />}
            style={{ marginRight: "10px" }}
            loading={isUpdateLoading}
            disabled={isFetchLoading || isUpdateLoading}
          >
            Xóa hết
            <Badge
              className="absolute -top-3 -right-2"
              count={selectedRowKeys.length}
            />
          </Button>
        </Popconfirm>
      ) : (
        <h2 className="text-lg nunito text-primary">
          <span className="text-black">Sản phẩm:</span> {productName}
        </h2>
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

      <ProductDetailModalCreate />
    </Col>
  </Flex>
);

export const AdminProductDetailTablePage = () => {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { token } = useToken();
  const { page, isFetchLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.productDetail
  );
  const { productSelected } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (pid) {
      dispatch(fetchProductAction({ pathVariable: pid }));
      dispatch(
        fetchProductDetailAction({
          pathVariable: pid,
          queryParams: {
            page: 0,
            pageSize: 10,
            sort: ["createdAt,desc"],
          },
        })
      );
    }
  }, [dispatch, pid]);

  const handleBulkDelete = () => {
    if (pid) {
      selectedRowKeys.forEach((key) => {
        dispatch(
          deleteProductDetailAction({ pdid: key.toString(), productId: pid })
        );
      });
      setSelectedRowKeys([]);
    }
  };

  return (
    <AdminLayout>
      <TableToolbar
        isFetchLoading={isFetchLoading}
        isUpdateLoading={isUpdateLoading}
        selectedRowKeys={selectedRowKeys}
        onDeleteAll={handleBulkDelete}
        productName={productSelected.product.name}
      />
      <Table
        onChange={(pagination, filters, sorter) => {
          const sort =
            sorter && Object.keys(sorter).length > 0
              ? (Array.isArray(sorter) ? sorter : [sorter]).map(
                  (it) =>
                    `${it.field},${it.order === "ascend" ? "asc" : "desc"}`
                )
              : ["createdAt,desc"];

          if (pid) {
            dispatch(
              fetchProductDetailAction({
                pathVariable: pid,
                queryParams: {
                  page: pagination.current ? pagination.current - 1 : 0,
                  pageSize: pagination.pageSize,
                  sort,
                  status:
                    filters && filters["status"]
                      ? (filters["status"][0] as boolean)
                      : undefined,
                },
              })
            );
          }
        }}
        pagination={{
          total: page.totalElements,
          pageSize: page.size,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `Total ${total} items`,
          size: "default",
        }}
        loading={isFetchLoading || isUpdateLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) =>
            setSelectedRowKeys(newSelectedRowKeys),
        }}
        columns={getColumns()}
        dataSource={page.content.map((it, index) => ({
          ...it,
          key: it.id,
          no: index + 1,
          name: (
            <AvatarsInfo
              fullName={productSelected.product.name + " - " + it.name}
              avatars={it.images}
              info={``}
            />
          ),
          price: currencyFormat(it.price),
          status: it.status,
          rate: it.rate,
          rateCount: it.rateCount,
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          actions: (
            <Dropdown
              trigger={["click"]}
              menu={{
                items: tableRowActions.map((item) => {
                  if (item.key === "1") {
                    return {
                      ...item,
                      label: <ProductDetailModalEdit productDetail={it} />,
                    };
                  }
                  return item;
                }),
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
                    style: { boxShadow: "none" },
                  })}
                  <Divider style={{ margin: 0 }} />
                  <div style={{ padding: 8 }}>
                    <Popconfirm
                      title={
                        it.status ? "Bạn có muốn xóa?" : "Bạn muỗn khôi phục?"
                      }
                      onConfirm={() =>
                        dispatch(
                          updateProductDetailStatusAction({
                            pdid: it.id,
                            status: !it.status,
                          })
                        )
                      }
                    >
                      <Button
                        className="w-full justify-start"
                        type={it.status ? "primary" : "default"}
                        loading={isUpdateLoading}
                      >
                        {it.status ? (
                          <>
                            <DeleteOutlined /> Delete
                          </>
                        ) : (
                          <>
                            <RollbackOutlined /> Restore
                          </>
                        )}
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              )}
            >
              <div className="text-center">
                <DashOutlined />
              </div>
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

const getColumns = () => {
  return [
    {
      title: "No.",
      dataIndex: "no",
    },
    {
      title: "Tên sản phẩm chi tiết",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 6,
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 5,
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rate",
      showSorterTooltip: { target: "full-header" },
      render: (rate: number) => <Rate disabled allowHalf value={rate} />,
      sorter: {
        multiple: 3,
      },
    },
    {
      title: "Rate Count",
      dataIndex: "rateCount",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 2,
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Trạng thái",
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
      filterMultiple: false,
      render: (status: boolean) => (
        <Tag
          icon={status ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={status ? "success" : "error"}
        >
          {status ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};
