import type {NextPage} from 'next'
import {NextRouter, useRouter} from "next/router";
import {DefaultLayout} from "../../components/layout";
import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Image, Result, Row, Spin, Typography} from "antd";
import axiosConfig from "../../utils/axios-config";
import {AxiosResponse} from "axios";
import {useDispatch, useSelector} from "react-redux";
import RateAdd from "../../components/rate-add";
import {MessageOutlined} from "@ant-design/icons";
import {UserResponseDTO} from "../../models/user/UserResponseAPI";
import {PaymentInfo, RateDTO, ShippingAddress} from "../../models/order/OrderRequest";
import {CurrentUser} from "../../stores/user.reducer";
import {RootState} from "../../stores";
import {setSelectedOrderItemRate, setShowModalAddRate, setShowModalRate} from "../../stores/rate.reducer";
import {setLoadingOrderItem} from "../../stores/order.reducer";
import {OrderItemResponseDTO} from "../../models/order_item/OrderItemResponseAPI";
import {OrderResponseDTO} from "../../models/order/OrderResposeAPI";
import RateRows from "../../components/rate-rows";
import {addItem, ICartItem} from "../../stores/cart.reducer";
import boolean from "async-validator/dist-types/validator/boolean";
import checkout from "../checkout";
import {exists} from "node:fs";

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

export interface IOrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    rate: RateDTO;
    productDetailId: string;
}

const OrderDetails = () => {

    const router: NextRouter = useRouter();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const isLoading: boolean = useSelector((state: RootState) => state.order.isLoadingOrderItem);

    const {oid} = router.query;

    const [order, seOrder] = useState<IOrder>();

    const [orderItems, seOrderItems] = useState<IOrderItem[]>([]);

    const [isError, setIsError] = useState<boolean>(false);

    const cartItems: ICartItem[] = useSelector((state: RootState) => state.cart.cartItems);

    const dispatch = useDispatch();

    useEffect(() => {
        getOrderItemById(oid as string);
    }, [isLoading]);

    const handleSetOrderItemRate = (id: string): void => {
        dispatch(setSelectedOrderItemRate(id));
        dispatch(setShowModalAddRate(true));
        // console.log(id);
    }

    const handleShowModalRate = (): void => {
        // console.log("hahahh")
        // dispatch(setSelectedOrderItemRate(id));
        dispatch(setShowModalRate(true));
        // console.log(id);
    }

    const getOrderItemById = (oid: string): void => {
        if (oid) {
            axiosConfig.get('/customer/orders/' + oid , {
                headers: {
                    Authorization: 'Bearer ' + currentUser.accessToken,
                }
            })
                .then(function (res: AxiosResponse<OrderResponseDTO>): void {
                    dispatch(setLoadingOrderItem(false));
                    const order: OrderResponseDTO = res.data;
                    const orderMapped: IOrder = {
                        id: order.id ?? "",
                        totalAmount: order.totalAmount ?? 0,
                        status: order.status ?? "",
                        user: order.user ?? {},
                        shippingAddress: order.shippingAddress ?? {},
                        paymentMethod: order.payment ?? {},
                        orderItems: order.orderItems?.map((orderItem: OrderItemResponseDTO): IOrderItem => {
                            return {
                                id: orderItem.id ?? "",
                                name: orderItem.productDetail?.product?.name ?? "",
                                quantity: orderItem.quantity ?? 0,
                                price: orderItem.price ?? 0,
                                image: orderItem.productDetail?.product?.thumbnail ?? "",
                                rate: orderItem.rate ?? {},
                                productDetailId: orderItem.productDetail?.id ?? "",
                            }
                        }) ?? [],
                    };
                    seOrder(orderMapped);
                    seOrderItems(orderMapped.orderItems);
                })
                .catch(function (): void {
                    setIsError(true);
                });
        }
    };

    const addOrderItemsCart = (): void => {
        orderItems.forEach((orderItem: IOrderItem): void => {
            let existItem : boolean = false;
            // console.log(orderItem);
            cartItems.forEach((cartItem: ICartItem): void => {
                console.log(cartItem);
                if (orderItem.productDetailId === cartItem.id) {
                    existItem = true;
                    return;
                }
            })
            if(!existItem){
                addToCart(orderItem.productDetailId, orderItem.price, orderItem.image, orderItem.name, orderItem.quantity);
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
            {isError ? (
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={
                        <Button type="primary" onClick={() => router.push('/')}>
                            Back Home
                        </Button>
                    }
                />
            ) : isLoading ? (
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
                                <Card title={'Order #' + order.id} style={{marginTop: '20px'}}>
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
                                        <Text style={{fontSize: '18px'}} strong>Shipping Address:</Text>
                                        <br/>
                                        <br/>
                                        <Text>{order.shippingAddress.address}</Text>
                                    </div>
                                    <Divider/>
                                    <Row gutter={[16, 16]}>
                                        {orderItems.map((item) => (
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
                                                            <Image src={item.image} style={{
                                                                width: '200px',
                                                                height: '150px',
                                                                objectFit: 'cover'
                                                            }}/>
                                                        </Col>
                                                        <Col span={18}
                                                             style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <Text strong
                                                                  style={{fontSize: '20px'}}>{item.quantity} x {item.name}</Text>
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
