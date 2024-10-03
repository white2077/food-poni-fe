import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import { useEffect } from "react";
import { fetchOrderRequest } from "@/redux/modules/order.ts"; // Thay đổi này
import { Card, Typography, List, Divider, Row, Col, Image, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ProductLoading } from "@/components/atoms/productLoading";
import HeadTable from "../table-head";
import { server } from "@/utils/server";
import { format } from "date-fns";

const { Title, Text } = Typography;

export default function OrderDetail() {
    const { orderId } = useParams<{ orderId: string }>();
    const dispatch = useDispatch();

    const { selectedOrder: order, isLoadingSelectedOrder } = useSelector((state: RootState) => state.order);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderRequest(orderId));
        }
    }, [orderId, dispatch]);

    if (isLoadingSelectedOrder) {
        return <ProductLoading />;
    }

    if (!order) {
        return <div>Không tìm thấy đơn hàng hoặc có lỗi xảy ra. Vui lòng thử lại sau.</div>;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <Card
                title={<Title level={3}>Đơn hàng chi tiết #{order.id?.substring(0, 7)}</Title>}
                className="shadow-lg"
            >
                <div className="flex justify-between items-center mb-4">
                    <Text strong className="text-lg">
                        {
                            order.status.includes("PENDING") ?
                                'Chờ xác nhận' : order.status.includes("APPROVED") ?
                                    'Chờ giao hàng' : 'Đơn hoàn tất'
                        }
                    </Text>
                </div>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card title="ĐỊA CHỈ NGƯỜI NHẬN" className="h-full">
                        <div className="font-bold mb-2">
                            <Text>{order.shippingAddress.fullName}</Text>
                        </div>
                        <div className="mb-2">
                            <Text>Địa chỉ: {order.shippingAddress.address}</Text>
                        </div>
                        <div>
                            <Text>Số điện thoại: {order.shippingAddress.phoneNumber}</Text>
                        </div>
                    </Card>
                    <Card title="HÌNH THỨC GIAO HÀNG" className="h-full">
                        <div className="mb-2">
                            <Text>Giao hàng nhanh</Text>
                        </div>
                        <div className="mb-2">
                            <Text>Giao vào thứ 5, 11/11</Text>
                        </div>
                        <div className="mb-2">
                            <Text>Được giao bởi BATMAN</Text>
                        </div>
                        <div>
                            <Text>Miễn phí vận chuyển</Text>
                        </div>
                    </Card>
                    <Card title="HÌNH THỨC THANH TOÁN" className="h-full">
                        <div>
                            <Text>{order.payment.method?.includes('CASH') ? 'Tiền mặt' : 'VNPay'}</Text>
                        </div>
                    </Card>
                </div>
                <div className="border rounded-lg p-4">
                    <HeadTable />
                    <Divider />
                    <List
                        dataSource={order.orderItems}
                        renderItem={(item) => (
                            <List.Item className="flex justify-between items-center">
                                <Col span={24} key={item.id} className="">
                                    <div style={{ overflow: 'hidden' }}>
                                        <div
                                            className="grid grid-cols-10 px-5 cursor-pointer">
                                            <div className="col-span-5">
                                                <div
                                                    className="font-sans text-[17px] text-gray-600">
                                                    <div className="flex gap-2">
                                                        <div
                                                            className="flex items-center">
                                                            <Image preview={false}
                                                                src={item?.productDetail?.product?.thumbnail ? server + item.productDetail.product.thumbnail : ""}
                                                                style={{
                                                                    width: '100px',
                                                                    height: '100px',
                                                                    objectFit: 'cover'
                                                                }}
                                                                className="rounded-lg" />
                                                        </div>
                                                        <div>
                                                            <div>
                                                                {item.productDetail.name}
                                                            </div>
                                                            <div
                                                                className="text-[14px]">
                                                                Người bán: <Text
                                                                    style={{ color: 'rgb(243, 111, 36)' }}>{order.user.username}</Text>
                                                            </div>
                                                            <div
                                                                className="text-[14px]">
                                                                Ngày bán: {format(new Date(order.createdDate ?? ""), "yyyy-MM-dd HH:mm:ss")}
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    style={{
                                                                        border: '1px solid rgb(243, 111, 36)',
                                                                        color: 'rgb(243, 111, 36)',
                                                                        pointerEvents: order.status.includes("COMPLETED") ? 'auto' : 'none', // Tạm ngưng hoặc cho phép sự kiện click
                                                                        opacity: order.status.includes("COMPLETED") ? 1 : 0.3 // Điều chỉnh độ mờ của nút
                                                                    }}
                                                                    onClick={() => {
                                                                        if (Object.keys(item.rate).length === 0) {

                                                                        }
                                                                    }}
                                                                >
                                                                    Đánh giá
                                                                </Button>
                                                                <Button style={{
                                                                    border: '1px solid rgb(243, 111, 36)',
                                                                    color: 'rgb(243, 111, 36)'
                                                                }}
                                                                >Xem
                                                                    đánh giá</Button>
                                                                <Button style={{
                                                                    border: '1px solid rgb(243, 111, 36)',
                                                                    color: 'rgb(243, 111, 36)'
                                                                }}>Mua lại</Button>

                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <div
                                                    className="font-sans text-[17px] text-gray-600">
                                                    {item.price}
                                                    <sup>₫</sup>
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <div
                                                    className="font-sans text-[17px] text-gray-600">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="col-span-1">
                                                <div
                                                    className="font-sans text-[17px] text-gray-600">
                                                    0
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-right">
                                                <div
                                                    className="font-sans text-[17px] text-gray-600">
                                                    {item.price * item.quantity}
                                                    <sup>₫</sup>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </Col>
                            </List.Item>
                        )}
                    />
                    <Divider />
                    <div className="flex justify-end items-center gap-8">
                        <div className="text-right text-gray-500">
                            <div className="mb-2">Tạm tính</div>
                            <div className="mb-2">Phí vận chuyển</div>
                            <div className="mb-2">Khuyến mãi vận chuyển</div>
                            <div className="mb-2">Giảm giá</div>
                            <div className="font-bold">Tổng cộng</div>
                        </div>
                        <div className="text-right">
                            <div className="mb-2">{order.totalAmount} ₫</div>
                            <div className="mb-2">{order.shippingFee} ₫</div>
                            <div className="mb-2">0 ₫</div>
                            <div className="mb-2">0 ₫</div>
                            <div className="text-2xl text-orange-600 font-bold">
                                {order.totalAmount + order.shippingFee} ₫
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <Link to="/orders" className="inline-block mt-6">
                <Button type="link" icon={<LeftOutlined />} className="text-orange-600 hover:text-orange-400">
                    Quay lại đơn hàng của tôi
                </Button>
            </Link>
        </div>
        // <div className='lg:w-[1440px] px-2 mx-auto items-center'>
        //     <Col span={20}>

        //     </Col>
        //     {/* <RateAdd/>
        //     <RateRows orderId={order.id}/> */}
        // </div>

    );
}