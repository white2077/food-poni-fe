import {NextRouter, useRouter} from "next/router";
import {DefaultLayout} from "../../components/layout";
import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Image, Row, Spin, Typography} from "antd";
import {AxiosResponse} from "axios";
import {useDispatch, useSelector} from "react-redux";
import RateAdd from "../../components/rate-add";
import {MessageOutlined} from "@ant-design/icons";
import {INITIAL_USER_API_RESPONSE, UserResponseDTO} from "../../models/user/UserResponseAPI";
import {paymentInfo, PaymentInfo, RateDTO, shippingAddress, ShippingAddress} from "../../models/order/OrderRequest";
import store, {RootState} from "../../stores";
import {setSelectedOrderItemRate, setShowModalAddRate, setShowModalRate} from "../../stores/rate.reducer";
import {OrderResponseDTO} from "../../models/order/OrderResposeAPI";
import RateRows from "../../components/rate-rows";
import {addItem, ICart, ICartItem} from "../../stores/cart.reducer";
import {ParsedUrlQuery} from "querystring";
import {setLoadingOrderItem} from "../../stores/order.reducer";
import type {NextApiRequest, NextApiResponse} from "next";
import {CookieValueTypes, getCookie} from "cookies-next";
import {accessToken, apiWithToken} from "../../utils/axios-config";
import {REFRESH_TOKEN, server} from "../../utils/server";

const {Text} = Typography;

export interface IOrder {
    id: string;
    totalAmount: number;
    status: string;
    user: UserResponseDTO;
    orderItems: IOrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentInfo;
}

export const INITIAL_IORDER = {
    id: "",
    totalAmount: 0,
    status: "",
    user: INITIAL_USER_API_RESPONSE,
    orderItems: [],
    shippingAddress: shippingAddress,
    paymentMethod: paymentInfo
};

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
    rate: RateDTO;
    productDetail: IProductDetailOrderItem;
    retailerId: string;
}

export async function getServerSideProps(context: { params: ParsedUrlQuery, req: NextApiRequest, res: NextApiResponse }) {
    const {oid} = context.params;
    const refreshToken: CookieValueTypes = getCookie(REFRESH_TOKEN, {req: context.req, res: context.res});
    if (refreshToken) {
        try {
            const res: AxiosResponse<OrderResponseDTO> = await apiWithToken(store.dispatch, refreshToken).get('/customer/orders/' + oid, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const order: OrderResponseDTO = res.data;

            const orderMapped: IOrder = {
                id: order.id ?? "",
                totalAmount: order.totalAmount ?? 0,
                status: order.status ?? "",
                user: order.user ?? INITIAL_USER_API_RESPONSE,
                shippingAddress: order.shippingAddress ?? {},
                paymentMethod: order.payment ?? {},
                orderItems: order.orderItems?.map((orderItem): IOrderItem => {
                    return {
                        id: orderItem.id ?? "",
                        name: orderItem.productDetail?.product?.name ?? "",
                        quantity: orderItem.quantity ?? 0,
                        price: orderItem.price ?? 0,
                        image: orderItem.productDetail?.product?.thumbnail ?? "",
                        rate: orderItem.rate ?? {},
                        productDetail: {
                            id: orderItem.productDetail?.id ?? "",
                            name: orderItem.productDetail?.name ?? "",
                            price: orderItem.productDetail?.price ?? 0
                        },
                        retailerId: orderItem.productDetail?.product?.user?.id ?? "",
                    }
                }) ?? [],
            };
            return {
                props: {
                    order: orderMapped,
                },
            };
        } catch (error) {
            console.error('Error fetching order:', error);
            return {
                props: {
                    order: null,
                },
            };
        }
    }

    return {
        redirect: {
            destination: '/login',
            permanent: false,
        },
    }
}

const OrderDetails = ({order = INITIAL_IORDER}: {order: IOrder}) => {

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
    },[order]);

    const handleSetOrderItemRate = (id: string): void => {
        dispatch(setSelectedOrderItemRate(id));
        dispatch(setShowModalAddRate(true));
    }

    const handleShowModalRate = (): void => {
        dispatch(setShowModalRate(true));
    }

    const addOrderItemsCart = (): void => {
        orderItems.forEach((orderItem: IOrderItem): void => {
            let existItem : boolean = false;
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
            if(!existItem){
                addToCart(orderItem.productDetail.id, orderItem.price, orderItem.image, orderItem.name, orderItem.quantity);
            }
        })
        router.push("/checkout");
    }

    const addToCart = (id: string, price : number, thumbnail: string, name: string, quantity: number): void => {
        const payload: ICartItem = {id, price, thumbnail, name, quantity} as ICartItem;
        dispatch(addItem(payload));
    };

    return (
        <DefaultLayout>
            {isLoading ? (
                <Spin style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} size="large"/>
            ) : (
                <>
                    {order && (
                        <Row className='lg:w-[1440px] px-2 mx-auto items-center'>
                            <Col span={20}>
                                <Card title={'Order #' + order.id?.substring(0, 7)} style={{marginTop: '20px'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
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
                                    <div>
                                        <Text style={{fontSize: '18px'}} strong>Đồ ăn</Text>
                                        <br/>
                                        <br/>
                                        <Text>{order.totalAmount + '$ - ' + order.orderItems.length + ' món - '} {order.paymentMethod.method?.includes('CASH') ? 'Tiền mặt' : 'VNPay'}</Text>
                                        <br/>
                                        <Text>{order.shippingAddress.fullName + ' - ' + order.shippingAddress.phoneNumber}</Text>
                                    </div>
                                    <div style={{marginTop: '20px'}}>
                                        <Text style={{fontSize: '18px'}} strong>Shipping address:</Text>
                                        <br/>
                                        <br/>
                                        <Text>{order.shippingAddress.address}</Text>
                                    </div>
                                    <Divider/>
                                    <Row gutter={[16, 16]}>
                                        {orderItems.map((item: IOrderItem) => (
                                            <Col span={24} key={item.id}>
                                                <Card hoverable style={{overflow: 'hidden'}}
                                                      onClick={() => {
                                                          if (Object.keys(item.rate).length === 0) {
                                                              handleSetOrderItemRate(item.id);
                                                          }
                                                      }}>
                                                    {Object.keys(item.rate).length !== 0 && (
                                                        <div style={{position: 'absolute', top: 5, right: 5}}>
                                                            <Text type="secondary" style={{color: 'red'}}>Đã đánh
                                                                giá</Text>
                                                        </div>
                                                    )}
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={6}>
                                                            <Image src={server + item.image} style={{
                                                                width: '200px',
                                                                height: '150px',
                                                                objectFit: 'cover'
                                                            }}/>
                                                        </Col>
                                                        <Col span={18}
                                                             style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <Text strong
                                                                  style={{fontSize: '20px'}}>{item.quantity} x {item.name} {item.productDetail.name ? "- " + item.productDetail.name : ""}</Text>
                                                            <Text strong style={{
                                                                fontSize: '20px',
                                                                color: 'green'
                                                            }}>{item.price} $</Text>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                    <div className="flex justify-between items-center md:p-4" >
                                        <Text className="hidden lg:flex text-lg" strong>Item
                                            Subtotal({order.orderItems.length + ' món'}):</Text>
                                        <Text style={{fontSize: '20px'}}>{order.totalAmount}$</Text>
                                    </div>
                                    <Divider/>
                                    <div style={{gap: "10px", display: "flex"}}>
                                        <Button style={{color: '#F36F24'}}
                                                onClick={handleShowModalRate}>Xem đánh giá</Button>
                                        <Button style={{backgroundColor: '#F36F24', color: 'white'}}
                                                onClick={addOrderItemsCart}
                                        >Đặt lại</Button>
                                    </div>
                                </Card>
                            </Col>
                            <RateAdd/>
                            <RateRows orderId={order.id}/>
                        </Row>
                    )}
                </>
            )}
        </DefaultLayout>
    );

};

export default OrderDetails;
