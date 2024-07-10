import {Badge, Button, Card, Col, Divider, Image, Row, Typography} from "antd";
import {EnvironmentOutlined, FieldTimeOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {format} from "date-fns";
import Link from "next/link";
import React from "react";
import {server} from "../utils/server";
import {OrderAPIResponse} from "../models/order/OrderAPIResponse";
import {OrderItemAPIResponse} from "../models/order_item/OrderItemResponseAPI";

const {Text} = Typography;

const OrderCard = ({order}: { order: OrderAPIResponse }) => {
    return (
        <div className="w-full">
            <Badge.Ribbon text={order.status} color="red">
                <Card hoverable title={"#" + order.id?.substring(0, 7)} bordered={false}>
                    <div className="flex items-center justify-between mb-4 font-bold">
                        <div>{order?.shippingAddress?.fullName}</div>
                        <div>{order?.shippingAddress?.phoneNumber}</div>
                    </div>
                    <Row gutter={[16, 16]}>
                        {order?.orderItems?.map((item: OrderItemAPIResponse) => (
                            <Col span={24} key={item.id}>
                                <Card className="overflow-hidden">
                                    {Object.keys(item.rate ?? {}).length !== 0 && (
                                        <div className="absolute top-[5px] right-[5px]">
                                            <Text type="secondary" className="!text-red-600">Đã đánh giá</Text>
                                        </div>
                                    )}
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}>
                                            <Image src={item?.productDetail?.product?.thumbnail ? server + item.productDetail.product.thumbnail : ""} style={{
                                                width: '120px',
                                                height: '90px',
                                                objectFit: 'cover'
                                            }}/>
                                        </Col>
                                        <Col span={18} className="flex justify-between">
                                            <p className="font-semibold text-xl">{item.quantity} x {item.productDetail?.product?.name} {item.productDetail?.name ? "- " + item.productDetail?.name : ""}</p>
                                            <p className="font-semibold text-xl text-green-700">{item.price} $</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <div className="my-3">
                        <span className="mr-2"><EnvironmentOutlined/></span>
                        <span>{order.shippingAddress?.address}</span>
                    </div>
                    <div>
                        <span className="mr-2"><FieldTimeOutlined/></span>
                        <span>{format(new Date(order.createdDate ?? ""), "yyyy-MM-dd HH:mm:ss")}</span>
                    </div>
                    <div className="flex justify-between mt-4 text-xl font-bold">
                        <div>Tổng tiền:</div>
                        <div>${order.totalAmount} </div>
                    </div>
                    <Divider/>
                    <div className="flex justify-between mt-4 ">
                        <div className="flex gap-2">
                            <Link href={`/order/${order.id}`}>
                                <Button style={{backgroundColor: '#F36F24', color: 'white'}}>Chi tiết</Button>
                            </Link>
                            <Button style={{backgroundColor: '#F36F24', color: 'white'}}>Đặt lại</Button>
                        </div>
                    </div>
                    <div className="flex justify-self-start mt-4 gap-2">
                        <InfoCircleOutlined/>
                        <p>Đánh giá ngay để tích thưởng</p>
                    </div>
                </Card>
            </Badge.Ribbon>
        </div>
    );
};

export default OrderCard;