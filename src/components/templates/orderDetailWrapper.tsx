import { useEffect } from "react";
import { ProductLoading } from "../atoms/productLoading";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchOrderRequest } from "@/redux/modules/order";
import { Button, Card, Divider, } from "antd";
import { OrderHeader } from "../molecules/orderHeaderOrder";

import HeadTable from "../table-head";
import { OrderItemList } from "../molecules/orderItemList";
import { OrderSummary } from "../atoms/orderSummaryProps";
import { LeftOutlined } from "@ant-design/icons";
import { OrderInfoCard } from "../molecules/orderInfoCard";


export default function OrderDetail() {
    const { orderId } = useParams<{ orderId: string }>();
    const dispatch = useDispatch();

    const { selectedOrder: order, isLoadingSelectedOrder } = useSelector((state: RootState) => state.order);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderRequest(orderId));
        }
    }, [orderId, dispatch]);

    if (isLoadingSelectedOrder) {
        return <ProductLoading />;
    }

    if (!order) {
        return <div>Không tìm thấy đơn hàng hoặc có lỗi xảy ra. Vui lòng thử lại sau.</div>;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <Card className="shadow-lg">
                <OrderHeader orderId={order.id} status={order.status} />
                <Divider />
                <OrderInfoCard />
                <div className="border rounded-lg p-4 mt-6">
                    <HeadTable />
                    <Divider />
                    <OrderItemList
                        orderItems={order.orderItems}
                        username={order.user.username}
                        createdDate={order.createdDate}
                        status={order.status}
                    />
                    <Divider />
                    <OrderSummary totalAmount={order.totalAmount} shippingFee={order.shippingFee} />
                </div>
            </Card>
            <Link to="/don-hang" className="inline-block mt-6">
                <Button type="link" icon={<LeftOutlined />} className="text-orange-600 hover:text-orange-400">
                    Quay lại đơn hàng của tôi
                </Button>
            </Link>
        </div>
    );
}