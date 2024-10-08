import {Button, Card, Col, Divider, Form, Input, Radio, RadioChangeEvent, Row, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {RootState} from "@/redux/store.ts";
import {useEffect} from "react";
import OrderItems from "@/components/organisms/orderItems.tsx";
import {fetchCartRequest} from "@/redux/modules/cart.ts";
import ShippingAddress from "@/components/organisms/shippingAddress.tsx";
import {createOrderRequest, updatePaymentSuccess} from "@/redux/modules/order.ts";

const {TextArea} = Input;

export default function CheckoutWrapper() {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const carts = useSelector((state: RootState) => state.cart.page);

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const {form, isCreateLoading} = useSelector((state: RootState) => state.order);

    const totalAmount = (): number => {
        return carts.content
            .filter(item => item.checked)
            .reduce((total, item) => {
                return total + item.productDetail.price * item.quantity;
            }, 0);
    };

    useEffect(() => {
        dispatch(fetchCartRequest());
    }, [dispatch]);

    return (
        <div style={{color: "black", textAlign: "left"}}>
            <h1 className="text-2xl mb-2">GIỎ HÀNG</h1>
            <Row gutter={16}>
                <Col flex='auto'>
                    <OrderItems></OrderItems>
                </Col>
                <Col flex='400px'>
                    <ShippingAddress/>
                    <Card style={{marginBottom: "16px"}}>
                        <div>
                            Thông tin thanh toán
                        </div>
                        <Radio.Group
                            onChange={(e: RadioChangeEvent): void => {
                                dispatch(updatePaymentSuccess(e.target.value));
                            }}
                            defaultValue={form.payment.method}>
                            <Space direction="vertical">
                                <Radio value="CASH">
                                    <div className="flex items-center"><img src="/tien-mat.png"
                                                                            className="w-9 h-9 mr-2"/><p>Thanh toán
                                        tiền mặt</p></div>
                                </Radio>
                                <Radio value="VNPAY">
                                    <div className="flex items-center"><img src="/VNP.png"
                                                                            className="w-9 h-9 mr-2"/>
                                        <div>
                                            <p>VNPAY</p>
                                            <div className="text-gray-400">Quét Mã QR từ ứng dụng ngân hàng</div>
                                        </div>
                                    </div>
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </Card>
                    <Card style={{marginBottom: "16px"}}>
                        <div className="flex justify-between">
                            <div className="text-gray-500">Tạm tính</div>
                            <span style={{float: 'right'}}>
                                    {totalAmount()}
                                <sup>₫</sup>
                                </span>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-gray-500">Giảm giá</div>
                            <span className="float-right">
                                    0
                                    <sup>₫</sup>
                                </span>
                        </div>
                        <Divider/>
                        <div className="flex justify-between">
                            <div className="text-gray-500">Tổng tiền</div>
                            <div className="grid">
                                <div className="text-2xl text-red-500 text-right float-right">
                                    {totalAmount()}
                                    <sup>₫</sup>
                                </div>
                                <div className="right-0 text-gray-400">(Đã bao gồm VAT nếu có)</div>
                            </div>
                        </div>
                    </Card>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{remember: true}}
                        onFinish={() => dispatch(createOrderRequest())}
                    >
                        <Form.Item
                            name="note"
                        >
                            <TextArea placeholder="Ghi chú" allowClear/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" danger block
                                    loading={isCreateLoading}
                                    disabled={carts.content.length == 0}>
                                Thanh toán
                            </Button>
                        </Form.Item>
                    </Form>

                </Col>
            </Row>
        </div>
    );

}