import { fetchConsolidatedInvoiceAction } from "@/redux/modules/invoice";
import { fetchOrdersByRetailerAction } from "@/redux/modules/order";
import { RootState } from "@/redux/store";
import { currencyFormat, getThumbnail, ORDER_STATUSES } from "@/utils/common";
import {
  CopyOutlined,
  DashOutlined,
  DownloadOutlined,
  LineOutlined,
} from "@ant-design/icons";
import { Button, Col, Dropdown, Flex, Table, TableColumnsType } from "antd";
import { format } from "date-fns";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { SalesLabel } from "../atoms/SalesLabel";
import { ManagementLayout } from "../templates/ManagementLayout";
import "./AdminOrderTablePage.scss";

const TableToolbar = () => (
  <Flex className="mb-4" justify="space-between">
    <Col></Col>
    <Col>
      <Button
        type="default"
        icon={<DownloadOutlined />}
        style={{ marginRight: "10px" }}
      >
        Download
      </Button>
    </Col>
  </Flex>
);

export const ConsolidatedInvoicePage = () => {
  const dispatch = useDispatch();
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.invoice
  );

  useEffect(() => {
    dispatch(
      fetchConsolidatedInvoiceAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["createdAt,desc"],
        },
      })
    );
  }, [dispatch]);

  return (
    <ManagementLayout>
      <TableToolbar />
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
        loading={isFetchLoading}
        columns={getColumns()}
        dataSource={page.content.map((it, index) => ({
          ...it,
          key: it.id,
          no: page.number * page.size + index + 1,
          code: it.id.toUpperCase().substring(0, 6),
          name: (
            <AvatarInfo
              fullName={it.user.username}
              avatar={getThumbnail(it.user.avatar)}
              info={""}
            />
          ),
          totalAmount: (
            <div className="font-medium">
              <div>{currencyFormat(it.totalAmount)}</div>
            </div>
          ),
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          status: <>{it.payment.status}</>,
          actions: (
            <div className="overflow-hidden">
              {it.id && <SalesLabel content="Nợ" />}
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
    </ManagementLayout>
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
      title: "Mã hóa đơn",
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
