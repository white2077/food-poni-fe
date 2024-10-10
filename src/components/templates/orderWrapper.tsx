import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { List } from "antd";
import { Order } from "@/type/types";

import { ProductLoading } from "../atoms/productLoading";
import OrderCard from "../molecules/orderCard";
import { fetchOrdersAction } from "@/redux/modules/order";

export default function OrderWrapper() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(
      fetchOrdersAction({
        queryParams: {
          page: 0,
          sort: "createdDate,desc",
          pageSize: 10,
        },
      })
    );
  }, [dispatch]);

  if (isFetchLoading) {
    return <ProductLoading />;
  }

  return (
    <List
      grid={{
        gutter: 16,
        column: 2,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 2,
        xl: 2,
        xxl: 2,
      }}
      dataSource={page.content}
      renderItem={(order: Order, index: number) => (
        <List.Item>
          <OrderCard order={order} index={(currentPage - 1) * 10 + index + 1} />
        </List.Item>
      )}
      pagination={{
        total: page.totalElements,
        pageSize: 10,
        current: currentPage,
        onChange: (page: number) => {
          setCurrentPage(page);
          dispatch(
            fetchOrdersAction({
              queryParams: {
                page: page - 1,
                sort: "createdDate,desc",
                pageSize: 10,
              },
            })
          );
        },
        showSizeChanger: false,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} đơn hàng`,
        style: { display: "flex", justifyContent: "center" },
      }}
    />
  );
}
