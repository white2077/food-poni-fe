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
        <div className="w-full ">
            <Badge.Ribbon text={order.status} color={order.status === "COMPLETED" ? "green" : "red"}>
                <Card hoverable title={"#" + order.id?.substring(0, 7)} bordered={false}>
                    <Row gutter={[16, 16]}>
                        {order?.orderItems?.map((item: OrderItemAPIResponse) => (
                            <Col span={24} key={item.id}>
                                <Link href={`/order/${order.id}`}>
                                    <Card className="overflow-hidden hover:bg-gray-100 hover:border-orange-300 border-2">
                                        {Object.keys(item.rate ?? {}).length !== 0 && (
                                            <div className="absolute top-[5px] right-[5px]">
                                                <Text type="secondary" className="!text-red-600">Đã đánh giá</Text>
                                            </div>

                                        )}
                                        <Row gutter={[16, 16]}>
                                            <Col span={5} >
                                                <div className="flex justify-center ">
                                                    <Image
                                                        src={item?.productDetail?.product?.thumbnail ? server + item.productDetail.product.thumbnail : ""}
                                                        style={{
                                                            width: '150px',
                                                            height: '95px',
                                                            objectFit: 'cover'
                                                        }} className="rounded-lg border-2 border-orange-300"/>
                                                    <p className=" font-['Impact','fantasy'] absolute text-[13px] border-orange-300 border-2 text-orange-600 bottom-0 right-2 bg-gray-100  px-1 rounded-br-lg rounded-tl-lg ">x{item.quantity}</p>
                                                </div>
                                            </Col>
                                            <Col span={19} className=" justify-between">
                                                <div className="flex justify-between">
                                                    <p>{item.productDetail?.product?.name}{item.productDetail?.name ? "- " + item.productDetail?.name : ""}</p>
                                                    <p className=" text-[15px] ">{item.price} $</p>
                                                </div>
                                                <div className="flex">
                                                    <div className="mr-2"><EnvironmentOutlined/></div>
                                                    <div>{order.shippingAddress?.address}</div>
                                                </div>
                                                <div className="flex">
                                                    <div className="mr-2"><FieldTimeOutlined/></div>
                                                    <div>{format(new Date(order.createdDate ?? ""), "yyyy-MM-dd HH:mm:ss")}</div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                    <div className="flex justify-end mt-4 text-xl gap-2">
                        <div className="text-gray-400">Tổng tiền:</div>
                        <div>${order.totalAmount} </div>
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
        </div>
    );
};

export default OrderCard;