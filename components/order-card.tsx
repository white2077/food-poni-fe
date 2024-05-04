import {Badge, Button, Card, Col, Divider, Image, Row} from "antd";
import {EnvironmentOutlined, FieldTimeOutlined, InfoCircleOutlined} from "@ant-design/icons";
import {format} from "date-fns";
import Link from "next/link";
import {OrderResponseDTO} from "../models/order/OrderResposeAPI";


const OrderCard = ({order}: { order: OrderResponseDTO }) => {
    return (
        <div className="w-full">
            <Badge.Ribbon text={order.status} color="red">
                <Card hoverable title={"#" + order.id?.substring(0, 7)} bordered={false}>
                    <div className="flex items-center justify-between mb-4 font-bold">
                        <div>{order?.shippingAddress?.fullName}</div>
                        <div>{order?.shippingAddress?.phoneNumber}</div>
                    </div>
                    <Row gutter={[16, 16]}>
                        {order?.orderItems?.map((item) => (
                            <Col span={24} key={item.id}>
                                <Card className="overflow-hidden" >
                                    <Row gutter={[16, 16]}>
                                        <Col span={6}>
                                            <Image  src={item?.productDetail?.product?.thumbnail ?? ""} style={{
                                                width: '120px',
                                                height: '90px',
                                                objectFit: 'cover'
                                            }}/>
                                        </Col>
                                        <Col span={18} className="flex justify-between">
                                            <p className="font-semibold text-xl">{item.quantity} x {item.productDetail?.product?.name}</p>
                                            <p className="font-semibold text-xl text-green-700">{item.price} $</p>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <div className="my-3" >
                        <span className="mr-2"><EnvironmentOutlined/></span>
                        <span>{order.shippingAddress?.address}</span>
                    </div>
                    <div>
                        <span className="mr-2"><FieldTimeOutlined/></span>
                        <span>{format(new Date(order.createdDate ?? ""), "yyyy-MM-dd HH:mm:ss")}</span>
                    </div>
                    <div className="flex justify-between mt-4 text-xl font-bold" >
                        <div>Total Amount:</div>
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
// =======
//         <Badge.Ribbon text={order.status} color="red">
//             {/*<Card title={"#" + order.id.substring(0, 7)} bordered={false}>*/}
//             {/*    <div style={{marginBottom: "5px", fontWeight: "bold", display: "flex", justifyContent: "space-between"}}>*/}
//             {/*        <div>{order.shippingAddress.fullName}</div>*/}
//             {/*        <div>{order.shippingAddress.phoneNumber}</div>*/}
//             {/*    </div>*/}
//             {/*    {order.orderItems.map((item: OrderItemResponseDTO, index: number) => (*/}
//             {/*        <div key={index} style={{marginBottom: "5px"}}>*/}
//             {/*            <div style={{display: "flex", justifyContent: "space-between"}}>*/}
//             {/*                <div>{item.productDetail.product.name} - {item.productDetail.name}</div>*/}
//             {/*                <div>x{item.quantity}</div>*/}
//             {/*            </div>*/}
//             {/*            <div style={{textAlign: "right"}}>${item.price}</div>*/}
//             {/*        </div>*/}
//             {/*    ))}*/}
//             {/*    <div style={{marginBottom: "5px"}}>*/}
//             {/*        <span style={{marginRight: "5px"}}><EnvironmentOutlined /></span>*/}
//             {/*        <span>{order.shippingAddress.address}</span>*/}
//             {/*    </div>*/}
//             {/*    <div>*/}
//             {/*        <span style={{marginRight: "5px"}}><FieldTimeOutlined/></span>*/}
//             {/*        <span>{format(new Date(order.createdDate), "yyyy-MM-dd HH:mm:ss")}</span>*/}
//             {/*    </div>*/}
//             {/*    <Divider/>*/}
//             {/*    <div style={{display: "flex", justifyContent: "space-between", marginTop: "12px", fontWeight: "bold"}}>*/}
//             {/*        <div>Total Amount:</div>*/}
//             {/*        <div>${order.totalAmount} </div>*/}
//             {/*    </div>*/}
//             {/*</Card>*/}
//         </Badge.Ribbon>
// >>>>>>> e43ab1cc9f8b3978e6cd6f8dcba8a782eb0cad84
    );
};

export default OrderCard;