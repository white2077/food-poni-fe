import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchOrderAction } from "@/redux/modules/order";
import { Button, Card, Divider, List, Avatar } from "antd";
import { OrderHeader } from "../molecules/OrderHeader.tsx";
import HeadTable from "../molecules/TableHead.tsx";
import { OrderSummary } from "../atoms/OrderSummaryProps.tsx";
import { LeftOutlined, UserOutlined } from "@ant-design/icons";
import { OrderInfoCard } from "../molecules/OrderInfoCard.tsx";
import { OrderItemPricing } from "../molecules/OrderItemPricing.tsx";
import { OrderItemDetail } from "../organisms/OrderItemDetail.tsx";
import { ProductLoading } from "@/components/atoms/ProductLoading.tsx";
import { ManagementLayout } from "../templates/ManagementLayout.tsx";
import { groupOrderByUser } from "@/utils/common.ts";

export const OrderGroupDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const { selectedOrder, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderAction({ orderId }));
    }
  }, [orderId, dispatch]);

  if (isFetchLoading || !selectedOrder) {
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
          <OrderInfoCard />
          <div className="border rounded-lg p-6 mt-6 bg-gray-50">
            <HeadTable />
            <Divider className="my-4" />
            {groupOrderByUser(selectedOrder.orderItems).map((groupedItems) => (
              <div key={groupedItems.user.id} className="mb-4">
                <Card
                  size="small"
                  className={`hover:shadow-md transition-shadow duration-300 ${groupedItems.user.id !== currentUser?.id ? "opacity-50" : "border border-primary"}`}
                  title={
                    <div className="flex items-center py-2">
                      <Avatar.Group>
                        {groupedItems.user.avatar ? (
                          <img
                            src={groupedItems.user.avatar}
                            alt={groupedItems.user.username}
                            className={`w-10 h-10 rounded-full object-cover border-2 transition-all duration-300
                                ${
                                  groupedItems.user.id === currentUser?.id
                                    ? "border-primary shadow-md"
                                    : "border-gray-300"
                                }`}
                          />
                        ) : (
                          <Avatar
                            icon={<UserOutlined />}
                            className={`w-10 h-10 !bg-gray-500 transition-all duration-300 ${
                              groupedItems.user.id === currentUser?.id
                                ? "border-2 border-primary shadow-md"
                                : "border-gray-300"
                            }`}
                          />
                        )}
                      </Avatar.Group>
                      <span className="ml-3 font-medium text-gray-700">
                        {groupedItems.user.username}
                      </span>
                    </div>
                  }
                >
                  <List
                    dataSource={groupedItems.items}
                    renderItem={(item) => (
                      <List.Item className="hover:bg-gray-50 transition-colors duration-200">
                        <div
                          className={`grid grid-cols-10 py-3 px-6 w-full relative rounded-lg
                        `}
                        >
                          <div className="col-span-5">
                            <OrderItemDetail
                              orderItem={item}
                              orderStatus={selectedOrder.status}
                            />
                          </div>
                          <div className="col-span-5">
                            <OrderItemPricing orderItem={item} />
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
                <Divider className="my-4" />
              </div>
            ))}
            <OrderSummary
              totalAmount={selectedOrder.totalAmount}
              shippingFee={selectedOrder.shippingFee}
            />
          </div>
        </Card>
        <Link to="/don-hang-nhom" className="inline-block mt-8">
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
