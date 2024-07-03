import {DefaultLayout} from "../components/layout";
import {
    Button,
    Card,
    Col,
    Collapse,
    Divider,
    Form,
    Input,
    List,
    Modal,
    notification,
    Radio,
    RadioChangeEvent,
    Result,
    Row,
    Space
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {deleteSelectedSoldItems, ICart, ICartItem} from "../stores/cart.reducer";
import React, {useEffect, useState} from "react";
import {NextRouter, useRouter} from "next/router";
import OrderItems from "../components/order-items";
import {RootState} from "../stores";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {OrderRequestDTO, PaymentInfo, ShippingAddress} from "../models/order/OrderRequest";
import {CurrentUser} from "../stores/user.reducer";
import {OrderItemRequestDTO} from "../models/order_item/OrderItemRequest";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {REFRESH_TOKEN} from "../utils/server";
import {NextApiRequest, NextApiResponse} from "next";
import {CookieValueTypes, getCookie} from "cookies-next";
import {AxiosResponse} from "axios";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import AddressCheckoutAdd from "../components/address-checkout-add";

const {TextArea} = Input;

export async function getServerSideProps({req, res}: { req: NextApiRequest, res: NextApiResponse }) {
    const refreshToken: CookieValueTypes = getCookie(REFRESH_TOKEN, {req, res});
    if (refreshToken) {
        try {
            const res: AxiosResponse<Page<AddressResponseDTO[]>> = await apiWithToken(refreshToken).get('/addresses', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            return {
                props: {
                    deliveryInformation: res.data
                }
            }
        } catch (error) {
            console.error('Error fetching category page:', error);
        }
    }

    return {
        redirect: {
            destination: '/login',
            permanent: false,
        },
    }
}

const Checkout = ({deliveryInformation = INITIAL_PAGE_API_RESPONSE}: {deliveryInformation: Page<AddressResponseDTO[]>}) => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const refreshToken = getCookie(REFRESH_TOKEN);

    const carts: ICart[] = useSelector((state: RootState) => state.cart.carts);

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const currentShippingAddress: AddressResponseDTO = useSelector((state: RootState) => state.address.shippingAddress);

    const [pending, setPending] = useState<boolean>(false);

    // const cartItems: ICartItem[] = useSelector((state: RootState) => state.cart.carts);

    const [payment, setPayment] = useState<PaymentInfo>({
        method: "CASH",
        status: "PAYING"
    });

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: currentShippingAddress.fullName,
        phoneNumber: currentShippingAddress.phoneNumber,
        address: currentShippingAddress.address
    });

    const [modal2Open, setModal2Open] = useState<boolean>(false);

    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);

    const totalAmount: number = carts.reduce((totalCart: number, cart: ICart) => {
        const cartTotal: number = cart.cartItems.reduce((total: number, item: ICartItem) => total + item.price, 0);
        return totalCart + cartTotal;
    }, 0);

    useEffect(() => {
        if (carts.length == 0) {
            router.push("/");
            notification.open({
                type: "warning",
                message: "Đơn hàng",
                description: "Vui lòng chọn ít nhất một sản phẩm!"
            });
        }
    }, [carts]);

    const addMultipleOrders = (): void => {
        let check = false;
        carts.forEach((cart: ICart) => {
            cart.cartItems.forEach((item: ICartItem) => {
                if (item.isSelectedICartItem) {
                    check = true;
                    return;
                }
            })
        })
        if (!check) {
            notification.open({
                type: "warning",
                message: "Đơn hàng",
                description: "Vui lòng chọn ít nhất một sản phẩm!"
            });
            return;
        }
        setPending(true);
        const requests = carts.map((values: any) => {
            const orderItems: OrderItemRequestDTO[] = values.cartItems.filter((item: ICartItem) => item.isSelectedICartItem).map((item: ICartItem) => {
                return {
                    quantity: item.quantity,
                    productDetail: item,
                    note: item.note
                };
            });
            const note: string = values.note;

            if(orderItems.length==0){
                return;
            }

            if (orderItems && shippingAddress && payment && refreshToken) {
                const order: OrderRequestDTO = {
                    orderItems,
                    shippingAddress: shippingAddress,
                    note,
                    payment: payment
                } as OrderRequestDTO;

                return apiWithToken(refreshToken).post("/orders", order, {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    }
                });
            } else {
                return Promise.reject(new Error("Some information is missing for this order."));
            }
        });

        Promise.all(requests)
            .then(function () {
                setPending(false);
                dispatch(deleteSelectedSoldItems());
                notification.open({
                    type: 'success',
                    message: 'Đơn hàng',
                    description: 'Bạn vừa tạo đơn hàng thành công!',
                });
                // Redirect to home page or any other appropriate action
                router.push('/');
            })
            .catch(function (error) {
                setPending(false);
                notification.open({
                    type: 'error',
                    message: 'Đơn hàng',
                    description: error.message
                });
            });
    };

    const onChange = (e: RadioChangeEvent): void => {
        setPayment(prevPaymentInfo => ({...prevPaymentInfo, method: e.target.value}));
    };

    const handleAddAddressClick = (): void => {
        setShowAddAddress(!showAddAddress);
    };

    return (
        <DefaultLayout>
            {
                currentUser.id ? (
                    <div style={{color: "black", textAlign: "left"}}>
                        <h1>GIỎ HÀNG</h1>
                        <Row gutter={16}>
                            <Col flex='auto'>
                                <OrderItems></OrderItems>
                            </Col>
                            <Col flex='400px'>
                                <Card style={{marginBottom: "16px"}}>
                                    <div>
                                        Giao tới
                                        <Button id="button-change-address" type='link' style={{float: 'right'}}
                                                onClick={() => {
                                                    setModal2Open(true);
                                                }}>Thay đổi</Button>
                                        <Modal
                                            title="Your address"
                                            centered
                                            open={modal2Open}
                                            onOk={() => setModal2Open(false)}
                                            onCancel={() => setModal2Open(false)}
                                            footer={null}
                                        >
                                            <Button
                                                onClick={handleAddAddressClick}>{showAddAddress ? "Cancel" : "Add address"}</Button>
                                            {showAddAddress && <AddressCheckoutAdd/>}
                                            {!showAddAddress && (
                                                <Radio.Group style={{width: '100%'}}
                                                             defaultValue={deliveryInformation.content.find(item => item.id === currentUser.addressId)}
                                                             onChange={(e: RadioChangeEvent) => setShippingAddress(e.target.value)}>
                                                    <List
                                                        dataSource={deliveryInformation.content}
                                                        renderItem={(item: AddressResponseDTO, index: number) => (
                                                            <Collapse
                                                                style={{margin: '16px 0'}}
                                                                expandIconPosition={"end"}
                                                                collapsible={"icon"}
                                                                items={[{
                                                                    key: index,
                                                                    label: <Radio id={`radio-${index}`} value={item}>
                                                                        <div><span
                                                                            style={{fontWeight: 'bold'}}>{item.fullName}</span> | {item.phoneNumber}
                                                                        </div>
                                                                        <div>{item.address}</div>
                                                                    </Radio>,
                                                                    children: <p>aaaaaaaaaaaaaaaa</p>
                                                                }]}
                                                            />
                                                        )}
                                                    />
                                                </Radio.Group>
                                            )}
                                        </Modal>
                                    </div>
                                    <div>
                                        {shippingAddress && (
                                            <>
                                                <div><span
                                                    style={{fontWeight: 'bold'}}>{shippingAddress.fullName}</span> | {shippingAddress.phoneNumber}
                                                </div>
                                                <div>{shippingAddress.address}</div>
                                            </>)
                                        }
                                        {!shippingAddress && (
                                            <div style={{color: 'red'}}>Vui lòng chọn thông tin vận chuyển</div>
                                        )}
                                    </div>
                                </Card>
                                <Card style={{marginBottom: "16px"}}>
                                    <div>
                                        Thông tin thanh toán
                                    </div>
                                    <Radio.Group onChange={onChange} value={payment.method}>
                                        <Space direction="vertical">
                                            <Radio value="CASH">Tiền mặt</Radio>
                                            <Radio value="VNPAY">VNPAY</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Card>
                                <Card style={{marginBottom: "16px"}}>
                                    <div>
                                        Tạm tính
                                        <span style={{float: 'right'}}>${totalAmount}</span>
                                    </div>
                                    <div>
                                        Giảm giá
                                        <span style={{float: 'right'}}>$0</span>
                                    </div>
                                    <Divider/>
                                    <div>
                                        Tổng tiền
                                        <span style={{float: 'right'}}>${totalAmount}</span>
                                    </div>
                                </Card>
                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{remember: true}}
                                    onFinish={addMultipleOrders}
                                >
                                    <Form.Item
                                        name="note"
                                    >
                                        <TextArea placeholder="Ghi chú" allowClear/>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" danger block loading={pending}>
                                            Thanh toán
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </div>
                ) : (
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>}
                    />
                )
            }
        </DefaultLayout>
    );

};

export default Checkout;