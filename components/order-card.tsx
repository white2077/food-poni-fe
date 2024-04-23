import {Badge, Card, Divider} from "antd";
import {Order, OrderItem} from "../model/Order";
import {EnvironmentOutlined, FieldTimeOutlined} from "@ant-design/icons";
import {format} from "date-fns";

const OrderCard = ({order}: { order: Order }) => {

    return (
        <Badge.Ribbon text={order.status} color="red">
            <Card title={"#" + order.id.substring(0, 7)} bordered={false}>
                <div style={{marginBottom: "5px", fontWeight: "bold", display: "flex", justifyContent: "space-between"}}>
                    <div>{order.shippingAddress.fullName}</div>
                    <div>{order.shippingAddress.phoneNumber}</div>
                </div>
                {order.orderItems.map((item: OrderItem, index) => (
                    <div key={index} style={{marginBottom: "5px"}}>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <div>{item.productDetail.product.name} - {item.productDetail.name}</div>
                            <div>x{item.quantity}</div>
                        </div>
                        <div style={{textAlign: "right"}}>${item.price}</div>
                    </div>
                ))}
                <div style={{marginBottom: "5px"}}>
                    <span style={{marginRight: "5px"}}><EnvironmentOutlined /></span>
                    <span>{order.shippingAddress.address}</span>
                </div>
                <div>
                    <span style={{marginRight: "5px"}}><FieldTimeOutlined/></span>
                    <span>{format(new Date(order.createdDate), "yyyy-MM-dd HH:mm:ss")}</span>
                </div>
                <Divider/>
                <div style={{display: "flex", justifyContent: "space-between", marginTop: "12px", fontWeight: "bold"}}>
                    <div>Total Amount:</div>
                    <div>${order.totalAmount} </div>
                </div>
            </Card>
        </Badge.Ribbon>
    )

}

export default OrderCard;