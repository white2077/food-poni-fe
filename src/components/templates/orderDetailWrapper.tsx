import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchOrderAction } from "@/redux/modules/order";
import { Button, Card, Divider, List } from "antd";
import { OrderHeader } from "../molecules/orderHeaderOrder";
import HeadTable from "../table-head";
import { OrderSummary } from "../atoms/orderSummaryProps";
import { LeftOutlined } from "@ant-design/icons";
import { OrderInfoCard } from "../molecules/orderInfoCard";
import { OrderItemPricing } from "../molecules/orderItemPricing";
import { OrderItemDetail } from "../organisms/orderItemDetail";
import {ProductLoading} from "@/components/atoms/productLoading.tsx";

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch();
  const { selectedOrder } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderAction({ orderId }));
    }
  }, [orderId, dispatch]);

  if (!selectedOrder) {
    return <ProductLoading/>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <OrderHeader orderId={selectedOrder.id} status={selectedOrder.status} />
        <Divider />
        <OrderInfoCard />
        <div className="border rounded-lg p-4 mt-6">
          <HeadTable />
          <Divider />
          <List
            dataSource={selectedOrder.orderItems}
            renderItem={(it) => (
              <List.Item className="flex justify-between items-center">
                <div className="grid grid-cols-10 px-5 cursor-pointer w-full">
                  <div className="col-span-5">
                    <OrderItemDetail
                      orderItem={it}
                      orderStatus={selectedOrder.status}
                    />
                  </div>
                  <div className="col-span-5">
                    <OrderItemPricing price={it.price} quantity={it.quantity} />
                  </div>
                </div>
              </List.Item>
            )}
          />
          <Divider />
          <OrderSummary
            totalAmount={selectedOrder.totalAmount}
            shippingFee={selectedOrder.shippingFee}
          />
        </div>
      </Card>
      <Link to="/quan-ly/don-hang" className="inline-block mt-6">
        <Button
          type="link"
          icon={<LeftOutlined />}
          className="text-orange-600 hover:text-orange-400"
        >
          Quay lại đơn hàng của tôi
        </Button>
      </Link>
    </div>
  );
}
