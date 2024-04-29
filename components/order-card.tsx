import {Badge, Button, Card, Col, Divider, Image, Modal, Row} from "antd";
import {EnvironmentOutlined, FieldTimeOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {format} from "date-fns";
import {OrderResponseDTO} from "../model/order/OrderResposeAPI";
import {OrderItemResponseDTO} from "../model/order_item/OrderItemResponseAPI";
import {useState} from "react";
import {PaymentInfo, RateDTO} from "../model/order/OrderRequest";
import {CurrentUser} from "../pages/login";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {setShowModalAddRate} from "../store/rate.reducer";
import Link from "next/link";

const OrderCard = ({order}: { order: OrderResponseDTO }) => {
    return (
        <div style={{width: "100%"}}>
            <Badge.Ribbon text={order.status} color="red">
                <Card hoverable title={"#" + order.id.substring(0, 7)} bordered={false}>
                    <div style={{
                        marginBottom: "5px",
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <div>{order.shippingAddress.fullName}</div>
                        <div>{order.shippingAddress.phoneNumber}</div>
                    </div>
                    <Row gutter={[16, 16]}>
                        {order.orderItems.map((item) => (
                            <Col span={24} key={item.id}>
                                <Card style={{overflow: 'hidden'}}>
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}>
                                            <Image src={item.productDetail.images[0]} style={{
                                                width: '120px',
                                                height: '90px',
                                                objectFit: 'cover'
                                            }}/>
                                        </Col>
                                        <Col span={18}
                                             style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <p
                                                style={{fontSize: '20px'}}>{item.quantity} x {item.productDetail.product.name}</p>
                                            <p style={{
                                                fontSize: '20px',
                                                color: 'green'
                                            }}>{item.price} $</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <div style={{margin: "10px 0"}}>
                        <span style={{marginRight: "5px"}}><EnvironmentOutlined/></span>
                        <span>{order.shippingAddress.address}</span>
                    </div>
                    <div>
                        <span style={{marginRight: "5px"}}><FieldTimeOutlined/></span>
                        <span>{format(new Date(order.createdDate), "yyyy-MM-dd HH:mm:ss")}</span>
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "12px",
                        fontWeight: "bold"
                    }}>
                        <div>Total Amount:</div>
                        <div>${order.totalAmount} </div>
                    </div>
                    <Divider/>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "12px",
                        fontWeight: "bold"
                    }}>
                        <div style={{gap: "10px", display: "flex"}}>
                            <Link href={`/order/${order.id}`}>
                                <Button type={"dashed"} danger>Chi tiết</Button>
                            </Link>
                            <Button type={"primary"} danger>Đặt lại</Button>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "left", marginTop: "12px", gap: "10px"}}>
                        <InfoCircleOutlined/>
                        <p>Đánh giá ngay để tích thưởng</p>
                    </div>
                </Card>
            </Badge.Ribbon>
        </div>
    );

};

export default OrderCard;