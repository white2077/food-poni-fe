import {Badge, Button, Card, Col, Image, Row, Typography} from "antd";
import {EnvironmentOutlined, FieldTimeOutlined, FormOutlined} from "@ant-design/icons";
import {format} from "date-fns";
import Link from "next/link";
import React from "react";
import {server} from "../utils/server";
import {OrderAPIResponse} from "../models/order/OrderAPIResponse";
import {OrderItemAPIResponse} from "../models/order_item/OrderItemAPIResponse";

const {Text} = Typography;

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

const OrderCard = ({order}: { order: OrderAPIResponse }) => {
    return (
        <Badge.Ribbon text={statusText[order.status]} color={statusColors[order.status]}>
            <Card hoverable={true} title={"#" + order.id?.substring(0, 7)}>
                <Row gutter={[16, 16]}>
                    {order?.orderItems?.map((item: OrderItemAPIResponse) => (
                        <Col span={24} key={item.id}>
                            <Link href={`/order/${order.id}`}>
                                <div
                                    className="overflow-hidden rounded-lg p-2 hover:bg-gray-100 hover:border-orange-300 border-2 ">
                                    <Row gutter={[16, 16]}>
                                        <Col span={5}>
                                            <div className="flex justify-center">
                                                <div className='relative' style={{position: 'relative'}}>
                                                    <Image
                                                        height='100px'
                                                        preview={false}
                                                        src={item?.productDetail?.product?.thumbnail ? server + item.productDetail.product.thumbnail : ""}
                                                        className="object-cover rounded-lg border-2 border-orange-300"
                                                    />
                                                    <p className="font-['Impact','fantasy'] absolute text-xs border-orange-300 border-2 bottom-1.5 right-0 text-orange-600 bg-gray-100  px-1 rounded-br-lg rounded-tl-lg">x{item.quantity}</p>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={19} className="justify-between">
                                            <div className="flex justify-between">
                                                <div>{item.productDetail?.product?.name}{item.productDetail?.name ? "- " + item.productDetail?.name : ""}</div>
                                                <div>
                                                    {item.price}
                                                    <sup>₫</sup>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div><EnvironmentOutlined/></div>
                                                <div>{order.shippingAddress?.address}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div><FieldTimeOutlined/></div>
                                                <div>{format(new Date(order.createdDate ?? ""), "yyyy-MM-dd HH:mm:ss")}</div>
                                            </div>
                                            {order.status === "COMPLETED" && Object.keys(item.rate ?? {}).length === 0 ? (
                                                <div className="flex gap-2">
                                                    <FormOutlined/>
                                                    <Text type="success" className="text-green-600 text-base font-sans">Đánh
                                                        giá ngay để nhận ưu đãi</Text>
                                                </div>
                                            ) : (
                                                Object.keys(item.rate ?? {}).length !== 0 && (
                                                    <div className="flex gap-2">
                                                        <FormOutlined/>
                                                        <Text className="text-red-600 text-base font-sans">Bạn đã đánh
                                                            giá</Text>
                                                    </div>
                                                )
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
                <div className="flex justify-end mt-4 text-xl gap-2">
                    <div className="text-gray-400">Tổng tiền:</div>
                    <div>
                        {order.totalAmount}
                        <sup>₫</sup>
                    </div>
                </div>
                <div className="flex justify-end mt-4  ">
                    <div className="flex gap-2 j">
                        <Link href={`/order/${order.id}`}>
                            <Button style={{backgroundColor: '#F36F24', color: 'white'}}>Chi tiết</Button>
                        </Link>
                        <Button style={{backgroundColor: '#F36F24', color: 'white'}}>Đặt lại</Button>
                    </div>
                </div>
            </Card>
        </Badge.Ribbon>
    );
};

export default OrderCard;