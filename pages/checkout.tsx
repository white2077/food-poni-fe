import {DefaultLayout} from "../components/layout";
import {
    Button,
    Card,
    Col,
    Collapse,
    Divider,
    Form,
    List,
    Modal,
    notification,
    Radio,
    RadioChangeEvent,
    Row,
    Space
} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {deleteAllItem, ICartItem} from "../store/cart.reducer";
import {CurrentUser} from "../model/User";
import {IOrder, IOrderItem, IPaymentInfo, IShippingAddress} from "../store/order.reducer";
import TextArea from "antd/es/input/TextArea";
import React, {useState} from "react";
import axiosConfig from "../utils/axios-config";
import {useRouter} from "next/router";
import {AxiosResponse} from "axios";
import {Page} from "../model/Common";
import {DeliveryInfomation} from "../model/DeliveryInfomation";
import OrderCartItems from "../components/order-cartItems";
import AddressAdd from "../components/address-add";

const isPayment: IPaymentInfo = {

    method: "CASH",

    status: "PAYING"
}

const isPending: boolean = false;

const Checkout = () => {

    const router = useRouter();

    const dispatch = useDispatch();

    const cartItems = useSelector(state => state.cart.cartItems) as ICartItem[];

    const currentUser = useSelector(state => state.user.currentUser) as CurrentUser;

    const [pending, setPending] = useState<boolean>(isPending);

    const [shippingAddress, setShippingAddress] = useState<IShippingAddress>();

    const [payment, setPayment] = useState<IPaymentInfo>(isPayment);

    const [deliveryInformationList, setDeliveryInformationList] = useState<DeliveryInfomation[]>([]);

    const [modal2Open, setModal2Open] = useState(false);

    const [showAddAddress, setShowAddAddress] = useState(false);

    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const getDeliveryInformationList = () => {
        axiosConfig.get("/addresses", {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<Page<DeliveryInfomation[]>>) {
                setDeliveryInformationList(res.data.content);
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Delivery information message',
                    description: res.message
                });
            })
    }

    const addToOrder = (values: any) => {
        setPending(true);
        const orderItems: IOrderItem[] = cartItems.map((item: ICartItem) => {
            return {
                quantity: item.quantity,
                productDetail: item,
                note: item.note
            };
        });
        const note: string = values.note;

        if (orderItems && shippingAddress && payment) {
            const order = {orderItems, shippingAddress, note, payment} as IOrder;

            axiosConfig.post("/orders", order, {
                headers: {
                    Authorization: 'Bearer ' + currentUser.accessToken,
                }
            })
                .then(function (res: any) {
                    setPending(false);
                    dispatch(deleteAllItem({}));
                    notification.open({
                        type: 'success',
                        message: 'Order message',
                        description: 'Create new order successfully!',
                    });
                    // redirect to home page
                    router.push('/');
                })
                .catch(function (res) {
                    setPending(false);
                    notification.open({
                        type: 'error',
                        message: 'Order message',
                        description: res.message
                    });
                })
        } else {
            setPending(false);
            notification.open({
                type: "error",
                message: "Order message",
                description: "Some information is missing. Please fill in all required fields."
            });
        }
    }

    const onChange = (e: RadioChangeEvent) => {
        setPayment(prevPaymentInfo => ({...prevPaymentInfo, method: e.target.value}));
    };

    const handleButtonClick = () => {
        setShowAddAddress(!showAddAddress);
    };

    return (
        <DefaultLayout>
            <div style={{color: "black", textAlign: "left"}}>
                <h1>GIỎ HÀNG</h1>
                <Row gutter={16}>
                    <Col flex='auto'>
                        <OrderCartItems></OrderCartItems>
                    </Col>
                    <Col flex='400px'>
                        <Card style={{marginBottom: "16px"}}>
                            <div>
                                Giao tới
                                <Button id="button-change-address" type='link' style={{float: 'right'}} onClick={() => {
                                    setModal2Open(true);
                                    getDeliveryInformationList();
                                }}>Thay đổi</Button>
                                <Modal
                                    title="Your address"
                                    centered
                                    open={modal2Open}
                                    onOk={() => setModal2Open(false)}
                                    onCancel={() => setModal2Open(false)}
                                >
                                    <Button onClick={handleButtonClick}>Add address</Button>
                                    {showAddAddress && <AddressAdd />}
                                    <Radio.Group style={{ width: '100%' }} onChange={(e) => setShippingAddress(e.target.value)}>
                                        <List
                                            dataSource={deliveryInformationList}
                                            renderItem={(item, index) => (
                                                <Collapse
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
                                <TextArea placeholder="Note" rows={4}/>
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
        </DefaultLayout>
    )
}

export default Checkout