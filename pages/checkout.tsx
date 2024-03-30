import {DefaultLayout} from "../components/layout";
import {
    Button,
    Card,
    Checkbox,
    Col, Collapse,
    Divider,
    Form, Input,
    InputNumber, List, Modal,
    notification,
    Radio,
    RadioChangeEvent,
    Row,
    Space
} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {deleteAllItem, ICartItem, setNote, setQuantity} from "../store/cart.reducer";
import {CurrentUser} from "../model/User";
import {IOrder, IOrderItem, IPaymentInfo, IShippingAddress} from "../store/order.reducer";
import TextArea from "antd/es/input/TextArea";
import React, {useState} from "react";
import axiosConfig from "../utils/axios-config";
import {useRouter} from "next/router";
import {AxiosResponse} from "axios";
import {Page} from "../model/common";
import {DeliveryInfomation} from "../model/DeliveryInfomation";

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

    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const getDeliveryInformationList = () => {
        axiosConfig.get(`/delivery-informations?userId=${currentUser.id}`, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<Page<DeliveryInfomation[]>>) {
                // console.log(res.data);
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
        const user = currentUser.id;
        const orderItems: IOrderItem[] = cartItems.map((item: ICartItem) => {
            return {
                quantity: item.quantity,
                productDetail: item,
                note: item.note
            };
        });
        const note: string = values.note;

        if (user && orderItems && shippingAddress && payment) {
            const order = {user, orderItems, shippingAddress, note, payment} as IOrder;

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

    const onChangeQuantity = (id: string, value: number) => {
        const payload = {id, value};
        dispatch(setQuantity(payload));
    }

    const onChange = (e: RadioChangeEvent) => {
        setPayment(prevPaymentInfo => ({...prevPaymentInfo, method: e.target.value}));
    };

    const onChangeNote = (itemId: string, note: string) => {
        dispatch(setNote({id: itemId, note}));
    };

    return (
        <DefaultLayout>
            <div style={{color: "black", textAlign: "left"}}>
                <h1>GIỎ HÀNG</h1>
                <Row gutter={16}>
                    <Col flex='auto'>
                        <div>
                            <Card style={{marginBottom: "16px"}}>
                                <Row>
                                    <Col flex='2%'>
                                        <Checkbox></Checkbox>
                                    </Col>
                                    <Col flex='40%'>Tất cả</Col>
                                    <Col flex='15%'>Đơn giá</Col>
                                    <Col flex='10%'>Số lượng</Col>
                                    <Col flex='15%'>Thành tiền</Col>
                                    <Col flex='26%'>Ghi chú</Col>
                                    <Col flex='2%'>
                                        <DeleteOutlined/>
                                    </Col>
                                </Row>
                            </Card>
                            <Card>
                                {cartItems.map((item, index) => (
                                    <Row key={index} style={{margin: '16px 0', alignItems: 'center'}}>
                                        <Col flex='2%'>
                                            <Checkbox></Checkbox>
                                        </Col>
                                        <Col flex='40%'>
                                            <div style={{display: 'flex', alignItems: 'center'}}>
                                                <div>
                                                    <img src={item.thumbnail} style={{width: "100px"}} alt="Product"/>
                                                </div>
                                                <div style={{marginLeft: '16px'}}>{item.name}</div>
                                            </div>
                                        </Col>
                                        <Col flex='15%'>${item.price}</Col>
                                        <Col flex='10%'>
                                            <InputNumber min={1}
                                                         max={20}
                                                         style={{maxWidth: '70px'}}
                                                         defaultValue={1}
                                                         value={item.quantity}
                                                         onChange={(value: number | null) => onChangeQuantity(item.id, value!)}/>
                                        </Col>
                                        <Col flex='15%'>${item.price * item.quantity}</Col>
                                        <Col flex='26%'>
                                            <TextArea
                                                placeholder="Note"
                                                value={item.note}
                                                onChange={(e) => onChangeNote(item.id, e.target.value)}
                                                rows={2}
                                            />
                                        </Col>
                                        <Col flex='2%'>
                                            <DeleteOutlined/>
                                        </Col>
                                    </Row>
                                ))}
                            </Card>
                        </div>
                    </Col>
                    <Col flex='400px'>
                        <Card style={{marginBottom: "16px"}}>
                            <div>
                                Giao tới
                                <Button type='link' style={{float: 'right'}} onClick={() => {
                                    setModal2Open(true);
                                    getDeliveryInformationList();
                                }}>Thay đổi</Button>
                                <Modal
                                    title="Vertically centered modal dialog"
                                    centered
                                    open={modal2Open}
                                    onOk={() => setModal2Open(false)}
                                    onCancel={() => setModal2Open(false)}
                                >
                                    <Radio.Group onChange={(e) => setShippingAddress(e.target.value)}>
                                        <List
                                            dataSource={deliveryInformationList}
                                            renderItem={(item, index) => (
                                                <Collapse
                                                    expandIconPosition={"end"}
                                                    collapsible={"icon"}
                                                    items={[{
                                                        key: index,
                                                        label: <Radio value={item}>
                                                            <div><span
                                                                style={{fontWeight: 'bold'}}>{item.fullName}</span> | {item.phoneNumber}
                                                            </div>
                                                            <div>{item.address}, {item.street}, {item.ward}, {item.district}, {item.province}</div>
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
                                        <div>{shippingAddress.address}, {shippingAddress.street}, {shippingAddress.ward}, {shippingAddress.district}, {shippingAddress.province}</div>
                                    </>)
                                }
                                {!shippingAddress && (
                                    <div style={{ color: 'red' }}>Vui lòng chọn thông tin vận chuyển</div>
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