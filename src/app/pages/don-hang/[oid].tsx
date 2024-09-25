import {NextRouter, useRouter} from "next/router";
import {DefaultLayout} from "../_layout";
import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Image, Result, Row, Spin, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import RateAdd from "../../components/rate-add";
import {LeftOutlined, MessageOutlined} from "@ant-design/icons";
import {UserAPIResponse} from "../../models/user/UserAPIResponse";
import {PaymentInfo, ShippingAddress} from "../../models/order/OrderRequest";
import {RootState} from "../../stores";
import {setSelectedOrderItemRate, setShowModalAddRate, setShowModalRate} from "../../stores/rate.reducer";
import RateRows from "../../components/rate-rows";
import {addItem, ICart, ICartItem} from "../../stores/cart.reducer";
import {ParsedUrlQuery} from "querystring";
import {setLoadingOrderItem} from "../../stores/order.reducer";
import type {NextApiRequest, NextApiResponse} from "next";
import {CookieValueTypes, getCookie} from "cookies-next";
import {REFRESH_TOKEN, server} from "../../utils/server";
import HeadTable from "../../components/table-head";
import Link from "next/link";
import {RateRequest} from "../../models/rate/RateRequest";
import {format} from "date-fns";
import {getOrderById} from "../../queries/order.query";

const {Text} = Typography;

export interface IOrder {
    id: string;
    totalAmount: number;
    status: string;
    user: UserAPIResponse;
    orderItems: IOrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentInfo;
    shippingFee: number;
    retailer: UserAPIResponse;
    createdDate: Date;
}

export interface IProductDetailOrderItem {
    id: string;
    name: string;
    price: number;
}

export interface IOrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    rate: RateRequest;
    productDetail: IProductDetailOrderItem;
    retailerId: string;
}

export async function getServerSideProps(context: {
    params: ParsedUrlQuery,
    req: NextApiRequest,
    res: NextApiResponse
}) {
    const {oid} = context.params;
    const refreshToken: CookieValueTypes = getCookie(REFRESH_TOKEN, {req: context.req, res: context.res});

    if (typeof oid !== 'string') {
        throw new Error('invalid oid');
    }

    try {
        const order = await getOrderById(oid, {
            refreshToken: refreshToken
        });

        return {props: {order}}
    } catch (e) {
        throw e;
    }
}

interface OrderDetailPageProps {
    order: IOrder
}

const OrderDetails = ({order}: OrderDetailPageProps) => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const carts: ICart[] = useSelector((state: RootState) => state.cart.carts);

    const isLoading: boolean = useSelector((state: RootState) => state.order.isLoadingOrderItem);

    const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);

    useEffect(() => {
        if (order && order.orderItems) {
            dispatch(setLoadingOrderItem(false));
            setOrderItems(order.orderItems);
        }
    }, [order]);

    const handleSetOrderItemRate = (id: string): void => {
        dispatch(setSelectedOrderItemRate(id));
        dispatch(setShowModalAddRate(true));
    }

    const handleShowModalRate = (): void => {
        dispatch(setShowModalRate(true));
    }

    const addOrderItemsCart = (): void => {
        orderItems.forEach((orderItem: IOrderItem): void => {
            let existItem: boolean = false;
            const cart = carts.find((cart: ICart): boolean => {
                return cart.id === orderItem.retailerId;
            })
            if (cart) {
                cart.cartItems.forEach((cartItem: ICartItem): void => {
                    console.log(cartItem);
                    if (orderItem.productDetail.id === cartItem.id) {
                        existItem = true;
                        return;
                    }
                })
            }
            if (!existItem) {
                addToCart(orderItem.productDetail.id, orderItem.price, orderItem.image, orderItem.name, orderItem.quantity);
            }
        })
        router.push("/checkout");
    }

    const addToCart = (id: string, price: number, thumbnail: string, name: string, quantity: number): void => {
        const payload: ICartItem = {id, price, thumbnail, name, quantity} as ICartItem;
        dispatch(addItem(payload));
    };

    return (
        <DefaultLayout>
            {
                order.id ? (
                    <div>
                        {
                            isLoading ? (
                                <Spin style={{
                                    width: '100%',
                                    height: '100vh',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} size="large"/>
                            ) : (
                                <div>
                                    {order && (
                                        <Row className='lg:w-[1440px] px-2 mx-auto items-center'>
                                            <Col span={20}>
                                                <Card title={'Đơn hàng chi tiết #' + order.id?.substring(0, 7)}>
                                                    <div className="flex justify-between">
                                                        <Text strong>
                                                            {
                                                                order.status.includes("PENDING") ?
                                                                    'Chờ xác nhận' : order.status.includes("APPROVED") ?
                                                                        'Chờ giao hàng' : 'Đơn hoàn tất'
                                                            }
                                                        </Text>
                                                        <MessageOutlined/>
                                                    </div>
                                                    <Divider/>
                                                    <div className="flex justify-between gap-3">
                                                        <Card style={{backgroundColor: ''}} title="ĐỊA CHỈ NGƯỜI NHẬN"
                                                              className="w-full">
                                                            <div className="font-bold">
                                                                <Text>{order.shippingAddress.fullName}</Text>
                                                            </div>
                                                            <div>
                                                                <Text>{'Địa chỉ: ' + order.shippingAddress.address}</Text>
                                                            </div>
                                                            <div>
                                                                <Text>{'Số điện thoại: ' + order.shippingAddress.phoneNumber}</Text>
                                                            </div>
                                                        </Card>
                                                        <Card style={{backgroundColor: ''}} title="HÌNH THỨC GIAO HÀNG"
                                                              className="w-full">
                                                            <div className="">
                                                                <Text>{'Giao hàng nhanh'}</Text>
                                                            </div>
                                                            <div>
                                                                <Text>{'Giao vào thứ 5 ,11/11'}</Text>
                                                            </div>
                                                            <div>
                                                                <Text> {'Được giao bởi BATMAN'}</Text>
                                                            </div>
                                                            <div>
                                                                <Text> {'Miễn phí vận chuyển'}</Text>
                                                            </div>
                                                        </Card>
                                                        <Card style={{backgroundColor: ''}} title="HÌNH THỨC THANH TOÁN"
                                                              className="w-full">
                                                            <div>
                                                                <Text> {order.paymentMethod.method?.includes('CASH') ? 'Tiền mặt' : 'VNPay'}</Text>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                    <div className="border-[1px] rounded-lg mt-6">
                                                        <HeadTable/>
                                                        <Divider/>
                                                        <Row gutter={[16, 16]}>
                                                            {orderItems.map((item: IOrderItem) => (
                                                                <Col span={24} key={item.id} className="">
                                                                    <div style={{overflow: 'hidden'}}>
                                                                        <div
                                                                            className="grid grid-cols-10 px-5 cursor-pointer">
                                                                            <div className="col-span-5">
                                                                                <div
                                                                                    className="font-sans text-[17px] text-gray-600">
                                                                                    <div className="flex gap-2">
                                                                                        <div
                                                                                            className="flex items-center">
                                                                                            <Image preview={false}
                                                                                                   src={server + item.image}
                                                                                                   style={{
                                                                                                       width: '100px',
                                                                                                       height: '100px',
                                                                                                       objectFit: 'cover'
                                                                                                   }}
                                                                                                   className="rounded-lg"/>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div>
                                                                                                {item.name}
                                                                                            </div>
                                                                                            <div
                                                                                                className="text-[14px]">
                                                                                                Người bán: <Text
                                                                                                style={{color: 'rgb(243, 111, 36)'}}>{order.retailer.username}</Text>
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
                                                                                                            handleSetOrderItemRate(item.id);
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    Đánh giá
                                                                                                </Button>
                                                                                                <Button style={{
                                                                                                    border: '1px solid rgb(243, 111, 36)',
                                                                                                    color: 'rgb(243, 111, 36)'
                                                                                                }}
                                                                                                        onClick={handleShowModalRate}>Xem
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
                                                                    <Divider/>
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                        <div
                                                            className="text-[17px] font-sans flex justify-end items-center pb-4 pr-4 gap-5">
                                                            <div className="text-right text-gray-400">
                                                                <div>Tạm tính</div>
                                                                <div>Phí vận chuyển</div>
                                                                <div>Khuyến mãi vận chuyển</div>
                                                                <div>Giảm giá</div>
                                                                <div>Tổng cộng</div>
                                                            </div>
                                                            <div className="text-right gap-6">
                                                                <div>
                                                                    {order.totalAmount}
                                                                    <sup>₫</sup>
                                                                </div>
                                                                <div>
                                                                    {order.shippingFee}
                                                                    <sup>₫</sup>
                                                                </div>
                                                                <div>0</div>
                                                                <div>0</div>
                                                                <div
                                                                    className="text-2xl text-orange-600">
                                                                    {order.totalAmount + order.shippingFee}
                                                                    <sup>₫</sup>
                                                                </div>
                                                                {/*giá sau khi giảm all ở đây nhé*/}
                                                            </div>
                                                        </div>
                                                        {/*<Text className="hidden lg:flex text-lg" strong>Item*/}
                                                        {/*    Subtotal({order.orderItems.length + ' món'}):</Text>*/}
                                                        {/*<Text style={{fontSize: '20px'}}>{order.totalAmount}$</Text>*/}
                                                        {/*<Divider/>*/}
                                                        {/*<div style={{gap: "10px", display: "flex"}}>*/}
                                                        {/*    <Button style={{color: '#F36F24'}}*/}
                                                        {/*    >Xem đánh giá</Button>*/}
                                                        {/*    <Button style={{backgroundColor: '#F36F24', color: 'white'}}*/}
                                                        {/*            onClick={addOrderItemsCart}*/}
                                                        {/*    >Đặt lại</Button>*/}
                                                        {/*</div>*/}
                                                    </div>
                                                    <Link href={'/orders'}>
                                                        <a>
                                                            <div className="text-orange-600 hover:text-orange-400 mt-4">
                                                                <LeftOutlined/>Quay lại đơn hàng của tôi
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </Card>
                                            </Col>
                                            <RateAdd/>
                                            <RateRows orderId={order.id}/>
                                        </Row>
                                    )}
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <Result
                        status="404"
                        title="404"
                        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại"
                        extra={<Button type="primary" onClick={() => router.push('/')}>Tiếp tục mua sắm</Button>}/>
                )
            }
        </DefaultLayout>
    );
};

export default OrderDetails;