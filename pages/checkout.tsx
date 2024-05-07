import {DefaultLayout} from "../components/layout";
import {
    Button,
    Card,
    Col,
    Collapse,
    Divider,
    Form, Input,
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
import {deleteAllItem, ICart, ICartItem} from "../stores/cart.reducer";
import React, {useState} from "react";
import axiosConfig from "../utils/axios-config";
import {NextRouter, useRouter} from "next/router";
import OrderItems from "../components/order-items";
import AddressAdd from "../components/address-add";
import {RootState} from "../stores";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {OrderItemRequestDTO} from "../models/order_item/OrderItemRequest";
import {OrderRequestDTO, PaymentInfo, ShippingAddress} from "../models/order/OrderRequest";
import {CurrentUser} from "../stores/user.reducer";
import cart from "../components/cart";

const {TextArea} = Input;

const Checkout = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const carts: ICart[] = useSelector((state: RootState) => state.cart.carts);

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const currentShippingAddress: AddressResponseDTO = useSelector((state: RootState) => state.address.shippingAddress);

    const deliveryInformationList: AddressResponseDTO[] = useSelector((state: RootState) => state.delivery.deliveryInformationList);

    const [pending, setPending] = useState<boolean>(false);

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

    const addToOrder = (values: any): void => {
        // setPending(true);
        // const orderItems: OrderItemRequestDTO[] = cartItems.map((item: ICartItem) => {
        //     return {
        //         quantity: item.quantity,
        //         productDetail: item,
        //         note: item.note
        //     };
        // });
        // const note: string = values.note;
        //
        // if (orderItems && shippingAddress && payment) {
        //     const order: OrderRequestDTO = {orderItems, shippingAddress, note, payment} as OrderRequestDTO;
        //
        //     axiosInterceptor.post("/orders", order, {
        //         headers: {
        //             Authorization: 'Bearer ' + currentUser.accessToken,
        //         }
        //     })
        //         .then(function () {
        //             setPending(false);
        //             dispatch(deleteAllItem({}));
        //             notification.open({
        //                 type: 'success',
        //                 message: 'Order message',
        //                 description: 'Create new order successfully!',
        //             });
        //             // redirect to home page
        //             router.push('/');
        //         })
        //         .catch(function (res) {
        //             setPending(false);
        //             notification.open({
        //                 type: 'error',
        //                 message: 'Order message',
        //                 description: res.message
        //             });
        //         });
        // } else {
        //     setPending(false);
        //     notification.open({
        //         type: "error",
        //         message: "Order message",
        //         description: "Some information is missing. Please fill in all required fields."
        //     });
        // }
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
                                            {showAddAddress && <AddressAdd/>}
                                            {!showAddAddress && (
                                                <Radio.Group style={{width: '100%'}}
                                                             defaultValue={deliveryInformationList.find(item => item.id === currentUser.addressId)}
                                                             onChange={(e: RadioChangeEvent) => setShippingAddress(e.target.value)}>
                                                    <List
                                                        dataSource={deliveryInformationList}
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
                                            <Radio value="CASH">CASH</Radio>
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
                                    onFinish={addToOrder}
                                >
                                    <Form.Item
                                        name="note"
                                    >
                                        <TextArea placeholder="Note" allowClear />
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