import { Col, List, Image, Typography, Button } from "antd";
import { format } from "date-fns";
import { server } from "@/utils/server";
const { Text } = Typography;

interface OrderItemListProps {
    orderItems: any[];
    username: string;
    createdDate: Date;
    status: string;
    onBuyAgain?: (item: any) => void;
    cartItems: any[];
}
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const OrderItemList: React.FC<OrderItemListProps> = ({ orderItems, username, createdDate, status, onBuyAgain, cartItems }) => {
    return (
        <List
            dataSource={orderItems}
            renderItem={(item) => {
                const isInCart = cartItems.some(cartItem => cartItem.productDetail.id === item.productDetail.id);
                return (
                    <List.Item className="flex justify-between items-center">
                        <Col span={24} key={item.id} className="">
                            <div style={{ overflow: 'hidden' }}>
                                <div className="grid grid-cols-10 px-5 cursor-pointer">
                                    <div className="col-span-5">
                                        <div className="font-sans text-[17px] text-gray-600">
                                            <div className="flex gap-2">
<<<<<<< HEAD
                                                <div className="flex items-center">
                                                    <Image
                                                        preview={false}
                                                        src={item?.productDetail?.product?.thumbnail ? server + item.productDetail.product.thumbnail : ""}
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            objectFit: 'cover'
                                                        }}
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <div>{item.productDetail.name}</div>
                                                    <div className="text-[14px]">
                                                        Người bán: <Text style={{ color: 'rgb(243, 111, 36)' }}>{username}</Text>
                                                    </div>
                                                    <div className="text-[14px]">
                                                        Ngày bán: {format(new Date(createdDate ?? ""), "yyyy-MM-dd HH:mm:ss")}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            style={{
                                                                border: '1px solid rgb(243, 111, 36)',
                                                                color: 'rgb(243, 111, 36)',
                                                                pointerEvents: status.includes("COMPLETED") ? 'auto' : 'none',
                                                                opacity: status.includes("COMPLETED") ? 1 : 0.3
                                                            }}
                                                            onClick={() => {
                                                                if (Object.keys(item.rate).length === 0) {

                                                                }
                                                            }}
                                                        >
                                                            Đánh giá
                                                        </Button>
                                                        <Button
                                                            style={{
                                                                border: '1px solid rgb(243, 111, 36)',
                                                                color: 'rgb(243, 111, 36)'
                                                            }}
                                                        >
                                                            Xem đánh giá
                                                        </Button>
                                                        <Button
                                                            onClick={() => !isInCart && onBuyAgain && onBuyAgain(item)}
                                                            style={{
                                                                border: '1px solid rgb(243, 111, 36)',
                                                                color: 'rgb(243, 111, 36)',
                                                                opacity: isInCart ? 0.5 : 1,
                                                                cursor: isInCart ? 'not-allowed' : 'pointer'
                                                            }}
                                                            disabled={isInCart}
                                                        >
                                                            {isInCart ? 'Đã có trong giỏ hàng' : 'Mua lại'}
                                                        </Button>
                                                    </div>
                                                </div>
=======
                                                <Button
                                                    style={{
                                                        border: '1px solid rgb(243, 111, 36)',
                                                        color: 'rgb(243, 111, 36)',
                                                        pointerEvents: status === "COMPLETED" ? 'auto' : 'none',
                                                        opacity: status === "COMPLETED" ? 1 : 0.3
                                                    }}
                                                    onClick={() => {
                                                        if (Object.keys(item.rate).length === 0) {
                                                            // Handle rating logic here
                                                        }
                                                    }}
                                                >
                                                    Đánh giá
                                                </Button>
                                                <Button
                                                    style={{
                                                        border: '1px solid rgb(243, 111, 36)',
                                                        color: 'rgb(243, 111, 36)'
                                                    }}
                                                >
                                                    Xem đánh giá
                                                </Button>
                                                <Button
                                                    style={{
                                                        border: '1px solid rgb(243, 111, 36)',
                                                        color: 'rgb(243, 111, 36)'
                                                    }}
                                                >
                                                    Mua lại
                                                </Button>
>>>>>>> f65ae546933e3c84c444e6b33ca0dfc52b09167a
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <div className="font-sans text-[17px] text-gray-600">
                                            {formatCurrency(item.price)}
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <div className="font-sans text-[17px] text-gray-600">
                                            {item.quantity}
                                        </div>
                                    </div>
                                    <div className="col-span-1">
                                        <div className="font-sans text-[17px] text-gray-600">
                                            0
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <div className="font-sans text-[17px] text-gray-600">
                                            {formatCurrency(item.price * item.quantity)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </List.Item>
                );
            }}
        />
    );
};