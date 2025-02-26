import { ProductLoading } from "@/components/atoms/ProductLoading.tsx";
import { fetchOrderItemsByOrderIdAction } from "@/redux/modules/orderItem.ts";
import { RootState } from "@/redux/store";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Divider } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { OrderHeader } from "../molecules/OrderHeader.tsx";
import { OrderInfoCard } from "../molecules/OrderInfoCard.tsx";
import { ManagementLayout } from "../templates/ManagementLayout.tsx";
import { fetchOrderByCustomerAction } from "@/redux/modules/order.ts";
import { OrderPostPaidDetailCard } from "../molecules/OrderPostPaidDetailCard.tsx";

export const OrderPostPaidDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch();
  const { selectedOrder, isFetchLoading: isFetchOrderLoading } = useSelector(
    (state: RootState) => state.order
  );
  const { page, isFetchLoading: isFetchOrderItemsLoading } = useSelector(
    (state: RootState) => state.orderItem
  );

  useEffect(() => {
    if (orderId) {
      dispatch(
        fetchOrderItemsByOrderIdAction({
          oid: orderId,
          queryParams: {
            page: 0,
            pageSize: 10,
            sort: ["createdAt,desc"],
            orderGroup: true,
          },
        })
      );
      dispatch(fetchOrderByCustomerAction({ orderId }));
    }
  }, [orderId, dispatch]);

  if (!selectedOrder || isFetchOrderLoading) {
    return (
      <ManagementLayout>
        <ProductLoading />
      </ManagementLayout>
    );
  }

  return (
    <ManagementLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="shadow-lg rounded-lg border-0">
          <OrderHeader
            orderId={selectedOrder.id}
            status={selectedOrder.status}
          />
          <Divider className="my-4" />
          <OrderInfoCard selectedOrder={selectedOrder} />
          <OrderPostPaidDetailCard
            isFetchOrderItemsLoading={isFetchOrderItemsLoading}
            page={page}
            selectedOrder={selectedOrder}
          />
        </Card>
        <Link to="/ghi-no" className="inline-block mt-8">
          <Button
            type="link"
            icon={<LeftOutlined />}
            className="text-orange-600 hover:text-primary transition-colors duration-300 flex items-center"
          >
            Quay lại đơn hàng của tôi
          </Button>
        </Link>
      </div>
    </ManagementLayout>
  );
};
