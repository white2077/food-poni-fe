import { Badge, Card, Col, Image, Row, Typography } from "antd";
import { EnvironmentOutlined, FormOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { Order } from "@/type/types";
import { server } from "@/utils/server";
import { Link } from "react-router-dom";
const { Text } = Typography;

const statusText: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  APPROVED: "Chờ lấy hàng",
  CANCELLED: "Đã hủy",
  REJECTED: "Bị từ chối",
  COMPLETED: "Hoàn thành",
};

const statusColors: Record<string, string> = {
  PENDING: "orange",
  APPROVED: "blue",
  CANCELLED: "red",
  REJECTED: "red",
  COMPLETED: "green",
};

const OrderCard = ({ order, index }: { order: Order; index: number }) => {
  return (
    <div>
      <Link to={`/quan-ly/don-hang/${order.id}`}>
        <Badge.Ribbon
          text={statusText[order.status]}
          color={statusColors[order.status]}
          className="font-sans"
        >
          <Card
            className="font-sans min-h-60 !border-orange-200"
            hoverable={true}
            title={
              <div className="flex gap-2 items-center">
                <span>{`${index}. Đơn hàng #${order.id
                  ?.substring(0, 7)
                  .toUpperCase()} `}</span>
                <span className="text-primary font-bold">/</span>
                <span>
                  {format(new Date(order.createdDate ?? ""), "dd-MM-yyyy")}
                </span>
                <span className="text-primary font-bold">/</span>
                <span>Số lượng: {order.orderItems.length}</span>
              </div>
            }
          >
            <Row
              gutter={[16, 16]}
              className="!overflow-y-scroll min-h-[8.3rem] max-h-[8.3rem] scrollbar-rounded"
            >
              {order?.orderItems?.map((item) => (
                <Col span={24} key={item.id}>
                  <div className="overflow-hidden rounded-lg p-2 hover:bg-gray-100 hover:border-orange-300 border-2 font-sans">
                    <Row gutter={[16, 16]}>
                      <Col
                        span={5}
                        className="flex justify-center items-center"
                      >
                        <div>
                          <div className="!relative flex">
                            <Image
                              height="100px"
                              preview={false}
                              src={
                                item?.productDetail?.product?.thumbnail
                                  ? server +
                                    item.productDetail.product.thumbnail
                                  : ""
                              }
                              className="object-cover rounded-lg border-2 border-orange-300"
                            />
                            <p className="absolute text-xs border-orange-300 border-2 bottom-0 right-0 text-orange-600 bg-gray-100 nunito px-1 rounded-br-lg rounded-tl-lg">
                              X{item.quantity}
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col span={19} className="justify-between">
                        <div className="flex justify-between  nunito">
                          <div className="text-orange-600 text-base">
                            {item.productDetail?.product?.name}
                            {item.productDetail?.name
                              ? ` - ${item.productDetail?.name}`
                              : ""}
                          </div>
                          <div>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)}
                          </div>
                        </div>

                        <div className="flex gap-2 font-sans"></div>
                        {order.status === "COMPLETED" &&
                        Object.keys(item.rate ?? {}).length === 0 ? (
                          <div className="flex gap-2 font-sans">
                            <FormOutlined />
                            <Text
                              type="success"
                              className="text-green-400 font-sans"
                            >
                              Đánh giá ngay để nhận ưu đãi
                            </Text>
                          </div>
                        ) : (
                          Object.keys(item.rate ?? {}).length !== 0 && (
                            <div className="flex gap-2 items-center">
                              <FormOutlined />
                              <div className="text-red-500 font-sans">
                                Bạn đã đánh giá
                              </div>
                            </div>
                          )
                        )}
                      </Col>
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
            <div className="flex justify-between">
              <div className="flex gap-2 font-sans items-end">
                <span className="">
                  {" "}
                  <EnvironmentOutlined />
                </span>
                {/* <div>{order.shippingAddress?.address?.length > 50 ? `${order.shippingAddress.address.substring(0, 50)}...` : order.shippingAddress.address}</div> */}
              </div>
              <div className="flex justify-end mt-4 text-xl gap-2 font-sans">
                <div className="text-gray-400">Tổng tiền:</div>
                <div className="nunito text-green-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(order.totalAmount)}
                </div>
              </div>
            </div>
          </Card>
        </Badge.Ribbon>
      </Link>
    </div>
  );
};

export default OrderCard;
