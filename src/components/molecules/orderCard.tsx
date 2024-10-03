import { Badge, Button, Card, Col, Image, Row, Typography } from "antd";
import { EnvironmentOutlined, FieldTimeOutlined, FormOutlined } from "@ant-design/icons";
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
    COMPLETED: "Hoàn thành"
};

const statusColors: Record<string, string> = {
    PENDING: "orange",
    APPROVED: "blue",
    CANCELLED: "red",
    REJECTED: "purple",
    COMPLETED: "green"
};

const OrderCard = ({ order }: { order: Order }) => {
    return (
        <Link to={`/don-hang/${order.id}`}>
            <Badge.Ribbon text={statusText[order.status]} color={statusColors[order.status]} className="font-sans">
                <Card className="font-sans min-h-60 !border-orange-200" hoverable={true} title={`Đơn hàng #${order.id?.substring(0, 7)}`}>
                    <Row gutter={[16, 16]} className="!overflow-y-scroll min-h-[8.3rem] max-h-[8.3rem] scrollbar-rounded">
                        {order?.orderItems?.map((item) => (
                            <Col span={24} key={item.id}>
                                <div className="overflow-hidden rounded-lg p-2 hover:bg-gray-100 hover:border-orange-300 border-2 font-sans">
                                    <Row gutter={[16, 16]}>
                                        <Col span={5} className="flex justify-center items-center">
                                            <div>
                                                <div className='!relative flex'>
                                                    <Image
                                                        height='100px'
                                                        preview={false}
                                                        src={item?.productDetail?.product?.thumbnail ? server + item.productDetail.product.thumbnail : ""}
                                                        className="object-cover rounded-lg border-2 border-orange-300"
                                                    />
                                                    <p className="absolute text-xs border-orange-300 border-2 bottom-0 right-0 text-orange-600 bg-gray-100 nunito px-1 rounded-br-lg rounded-tl-lg">
                                                        X{item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={19} className="justify-between">
                                            <div className="flex justify-between nunito">
                                                <div className="text-orange-600 text-base">
                                                    {item.productDetail?.product?.name}
                                                    {item.productDetail?.name ? ` - ${item.productDetail?.name}` : ""}
                                                </div>
                                                <div>
                                                    {item.price}
                                                    <sup>₫</sup>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 font-sans">
                                                <EnvironmentOutlined />
                                                <div>{order.shippingAddress?.address}</div>
                                            </div>
                                            <div className="flex gap-2 font-sans">
                                                <FieldTimeOutlined />
                                                <div>{format(new Date(order.createdDate ?? ""), "yyyy-MM-dd HH:mm:ss")}</div>
                                            </div>
                                            {order.status === "COMPLETED" && Object.keys(item.rate ?? {}).length === 0 ? (
                                                <div className="flex gap-2 font-sans">
                                                    <FormOutlined />
                                                    <Text type="success" className="text-green-400 font-sans">Đánh giá ngay để nhận ưu đãi</Text>
                                                </div>
                                            ) : (
                                                Object.keys(item.rate ?? {}).length !== 0 && (
                                                    <div className="flex gap-2 items-center">
                                                        <FormOutlined />
                                                        <div className="text-red-500 font-sans">Bạn đã đánh giá</div>
                                                    </div>
                                                )
                                            )}
                                        </Col>
                                    </Row>
                                </div>

                            </Col>
                        ))}
                    </Row>
                    <div className="flex justify-end mt-4 text-xl gap-2 font-sans">
                        <div className="text-gray-400">Tổng tiền:</div>
                        <div className="nunito text-green-600">
                            {order.totalAmount}
                            <sup>₫</sup>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <div className="flex gap-2">

                            <Button style={{ backgroundColor: '#F36F24', color: 'white' }}>Đặt lại</Button>
                        </div>
                    </div>
                </Card>

            </Badge.Ribbon>
        </Link>
    );
};

export default OrderCard;