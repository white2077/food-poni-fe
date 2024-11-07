import { fetchOrdersByRetailerAction } from "@/redux/modules/order";
import { RootState } from "@/redux/store";
import { currencyFormat, getThumbnail, ORDER_STATUSES } from "@/utils/common";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DashOutlined,
  DownloadOutlined,
  ImportOutlined,
  LineOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  Flex,
  Popconfirm,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { SalesLabel } from "../atoms/SalesLabel";
import { AdminLayout } from "../templates/AdminLayout";
import "./AdminOrderTablePage.scss";
import { OrderStatus } from "@/type/types";

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
    </Col>
  </Flex>
);

export const AdminOrderTablePage = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { page, isFetchLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(
      fetchOrdersByRetailerAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["createdAt,desc"],
        },
      })
    );
  }, [dispatch]);

  return (
    <AdminLayout>
      <TableToolbar
        isFetchLoading={isFetchLoading || isUpdateLoading}
        selectedRowKeys={selectedRowKeys}
      />
      <Table
        onChange={(pagination, filters, sorter) => {
          const sort =
            sorter && Object.keys(sorter).length > 0 // Kiểm tra nếu sorter không phải là đối tượng rỗng
              ? (Array.isArray(sorter) // Kiểm tra nếu sorter là một mảng
                  ? sorter // Nếu là mảng, giữ nguyên
                  : [sorter]
                ).map(
                  (it) =>
                    `${it.field},${it.order === "ascend" ? "asc" : "desc"}`
                )
              : []; // Nếu là đối tượng, biến thành mảng rỗng

          dispatch(
            fetchOrdersByRetailerAction({
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
        }}
        pagination={{
          total: page.totalElements,
          pageSize: page.size,
          current: page.number + 1,
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
          no: page.number * page.size + index + 1,
          code: it.id.toUpperCase(),
          name: (
            <AvatarInfo
              fullName={it.shippingAddress.fullName}
              avatar={getThumbnail(it.user.avatar)}
              info={`${it.user.username}`}
            />
          ),
          totalAmount: (
            <div className="font-medium dark:text-white">
              <div>{currencyFormat(it.totalAmount + it.shippingFee)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total amount: {currencyFormat(it.totalAmount)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Shipping fee: {currencyFormat(it.shippingFee)}
              </div>
            </div>
          ),
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          status: (
            <>
              <Dropdown
                menu={{
                  items: ORDER_STATUSES.map((it) => ({
                    ...it,
                    icon:
                      it.key === "PENDING" ? (
                        <ClockCircleOutlined />
                      ) : it.key === "REJECTED" ? (
                        <CheckCircleOutlined />
                      ) : it.key === "APPROVED" ? (
                        <CloseCircleOutlined />
                      ) : it.key === "DELIVERING" ? (
                        <CloseCircleOutlined />
                      ) : it.key === "COMPLETED" ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      ),
                  })),
                }}
              >
                <Tag
                  icon={<OrderStatusIcon status={it.status} />}
                  color={
                    it.status === "PENDING"
                      ? "processing"
                      : it.status === "REJECTED"
                        ? "gold"
                        : it.status === "APPROVED"
                          ? "success"
                          : it.status === "DELIVERING"
                            ? "warning"
                            : it.status === "COMPLETED"
                              ? "success"
                              : "error"
                  }
                >
                  {it.status}
                </Tag>
              </Dropdown>
              {/* <Popconfirm
                title="Sure to delete?"
                onConfirm={() =>
                  dispatch(
                    updateOrderStatusAction({
                      pid: it.id,
                      status: !it.status,
                    })
                  )
                }
              >
                <Tag
                  icon={
                    it.status ? (
                      <CheckCircleOutlined />
                    ) : (
                      <CloseCircleOutlined />
                    )
                  }
                  color={"success"}
                >
                  {it.status}
                </Tag>
              </Popconfirm> */}
            </>
          ),
          actions: (
            <div className="overflow-hidden">
              {it.postPaidOrderId && <SalesLabel content="Nợ" />}
              <Dropdown
                trigger={["click"]}
                placement="bottomLeft"
                arrow={{ pointAtCenter: true }}
                menu={{
                  items: tableRowActions,
                }}
              >
                <div className="text-center">
                  <DashOutlined />
                </div>
              </Dropdown>
            </div>
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
    icon: <CopyOutlined />,
    label: "Copy ID",
  },
  {
    key: "2",
    icon: <LineOutlined />,
    label: "Copy Data Row",
  },
];

const getColumns = () => {
  return [
    {
      title: "No.",
      dataIndex: "no",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: ORDER_STATUSES.map((it) => ({
        text: it.label,
        value: it.key,
      })),
      filterMultiple: true,
    },
    {
      title: "__________Khách hàng",
      dataIndex: "name",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};

const OrderStatusIcon = ({ status }: { status: OrderStatus }) => {
  return status === "PENDING" ? (
    <ClockCircleOutlined />
  ) : status === "REJECTED" ? (
    <CloseCircleOutlined />
  ) : status === "APPROVED" ? (
    <CheckCircleOutlined />
  ) : status === "DELIVERING" ? (
    <SyncOutlined spin />
  ) : status === "COMPLETED" ? (
    <CheckCircleOutlined />
  ) : (
    <CloseCircleOutlined />
  );
};
