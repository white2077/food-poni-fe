import {DefaultLayout} from "../components/layout";
import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Form, Input,
    InputNumber,
    notification,
    Radio,
    RadioChangeEvent,
    Row,
    Space
} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {ICartItem, setNote, setQuantity} from "../store/cart.reducer";
import {CurrentUser} from "../model/User";
import {IOrder, IOrderItem, IPaymentInfo} from "../store/order.reducer";
import TextArea from "antd/es/input/TextArea";
import React, {useState} from "react";
import axiosConfig from "../utils/axios-config";
import {useRouter} from "next/router";

const isPayment: IPaymentInfo = {

    method: "CASH",

    status: "PAYING"
}

const isAddress: string = "Tòa ViwaSeen 48 Tố Hữu, Phường Trung Văn, Quận Nam Từ Liêm, Hà Nội";

const isPending: boolean = false;

const Checkout = () => {

    const router = useRouter();

    const dispatch = useDispatch();

    const cartItems = useSelector(state => state.cart.cartItems) as ICartItem[];

    const currentUser = useSelector(state => state.user.currentUser) as CurrentUser;

    const [pending, setPending] = useState<boolean>(isPending);

    const [orderAddress, setOrderAddress] = useState<string>(isAddress);

    const [payment, setPayment] = useState<IPaymentInfo>(isPayment);

    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    // axiosConfig.get(`/delivery-informations?userId=${currentUser.id}`, {
    //     headers: {
    //         Authorization: 'Bearer ' + currentUser.accessToken,
    //     }
    // })
    //     .then(function (res) {
    //         console.log(res);
    //         notification.open({
    //             message: 'Delivery information message',
    //             description: 'Get Delivery information successfully!',
    //         });
    //     })
    //     .catch(function (res) {
    //         notification.open({
    //             message: 'Delivery information message',
    //             description: res.message
    //         });
    //     })

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

        const order = {user, orderItems, orderAddress, note, payment} as IOrder;

        console.log(order);

        axiosConfig.post("/orders", order, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: any) {
                setPending(false);
                // redirect to home page
                notification.open({
                    message: 'Order message',
                    description: 'Create new order successfully!',
                });
                router.push('/');
            })
            .catch(function (res) {
                setPending(false);
                notification.open({
                    message: 'Order message',
                    description: res.message
                });
            })
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
                    </Col>
                    <Col flex='400px'>
                        <Card style={{marginBottom: "16px"}}>
                            <div>
                                Giao tới
                                <a style={{float: 'right'}} href="">Thay đổi</a>
                            </div>
                            <div>
                                <div>{currentUser.firstName + ' ' + currentUser.lastName} | {currentUser.phoneNumber}</div>
                                <div>{orderAddress}</div>
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