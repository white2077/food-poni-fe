import {Button, Card, Col, Divider, Form, Input, Modal, Radio, RadioChangeEvent, Row, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {RootState} from "@/redux/store.ts";
import {useEffect, useState} from "react";
import {PaymentInfo, ShippingAddress} from "@/type/types.ts";
import OrderItems from "@/components/order-items.tsx";
import CardHome from "@/components/card-home.tsx";
import {fetchCartRequest} from "@/redux/modules/cart.ts";

const {TextArea} = Input;

export default function CheckoutWrapper() {

    const nagative = useNavigate();

    const dispatch = useDispatch();

    const carts = useSelector((state: RootState) => state.cart.data);

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const currentShippingAddress = useSelector((state: RootState) => state.address.shippingAddress);

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

    // const totalAmount: number = useMemo(() => {
    //     return carts.reduce((totalCart: number, cart: ICart) => {
    //         const cartTotal: number = cart.cartItems.reduce((total: number, item: ICartItem) => {
    //             if (item.isSelectedICartItem) {
    //                 return total + item.price * item.quantity;
    //             }
    //             return total;
    //         }, 0);
    //         return totalCart + cartTotal;
    //     }, 0);
    // }, [carts]);

    useEffect(() => {
        dispatch(fetchCartRequest());
    }, []);

    // useEffect(() => {
    //     setShippingAddress({
    //         fullName: currentShippingAddress.fullName,
    //         phoneNumber: currentShippingAddress.phoneNumber,
    //         address: currentShippingAddress.address
    //     });
    // }, [currentShippingAddress]);

    const addMultipleOrders = (): void => {
        // let check = false;
        // carts.forEach((cart: ICart) => {
        //     cart.cartItems.forEach((item: ICartItem) => {
        //         if (item.isSelectedICartItem) {
        //             check = true;
        //             return;
        //         }
        //     })
        // })
        // if (!check) {
        //     notification.open({
        //         type: "warning",
        //         message: "Đơn hàng",
        //         description: "Vui lòng chọn ít nhất một sản phẩm!"
        //     });
        //     return;
        // }
        // setPending(true);
        // const requests = carts.map((values: any) => {
        //     console.log(values);
        //     const orderItems: OrderItemRequestDTO[] = values.cartItems.filter((item: ICartItem) => item.isSelectedICartItem).map((item: ICartItem) => {
        //         return {
        //             quantity: item.quantity,
        //             productDetail: item,
        //             note: item.note
        //         };
        //     });
        //     const note: string = values.note;
        //     if (orderItems.length == 0) {
        //         return;
        //     }
        //     if (orderItems && shippingAddress && payment && refreshToken) {
        //         const order: OrderCreationRequestDTO = {
        //             orderItems,
        //             shippingAddress: shippingAddress,
        //             note,
        //             payment: payment,
        //             retailerId: orderItems[0].productDetail.retailer.id ?? "retailer"
        //         } as OrderCreationRequestDTO;
        //
        //         return apiWithToken().post("/orders", order, {
        //             headers: {
        //                 Authorization: 'Bearer ' + accessToken,
        //             }
        //         });
        //     } else {
        //         return Promise.reject(new Error("Some information is missing for this order."));
        //     }
        // });
        //
        // Promise.all(requests)
        //     .then(function () {
        //         dispatch(deleteSelectedSoldItems());
        //         notification.open({
        //             type: 'success',
        //             message: 'Đơn hàng',
        //             description: 'Bạn vừa tạo đơn hàng thành công!',
        //         });
        //         // Redirect to home page or any other appropriate action
        //         router.push('/').then(() => {
        //             setPending(false);
        //         });
        //     })
        //     .catch(function (error) {
        //         notification.open({
        //             type: 'error',
        //             message: 'Đơn hàng',
        //             description: error.message
        //         });
        //         setPending(false);
        //     });
    };

    const onChange = (e: RadioChangeEvent): void => {
        setPayment(prevPaymentInfo => ({...prevPaymentInfo, method: e.target.value}));
    };

    const handleAddAddressClick = (): void => {
        setShowAddAddress(!showAddAddress);
    };

    return (
        <div style={{color: "black", textAlign: "left"}}>
            <h1 className="text-2xl mb-2">GIỎ HÀNG</h1>
            <Row gutter={16}>
                <Col flex='auto'>
                    <OrderItems></OrderItems>
                </Col>
                <Col flex='400px'>
                    <Card style={{marginBottom: "16px"}}>
                        <div>
                            <div className="flex justify-between items-center">
                                <div className="text-[17px] text-gray-400">Giao tới</div>
                                <Button id="button-change-address" type="link"
                                        onClick={() => {
                                            setModal2Open(true);
                                        }}>Thay đổi</Button>
                            </div>
                            <Modal
                                title="Địa chỉ của bạn"
                                centered
                                open={modal2Open}
                                onOk={() => setModal2Open(false)}
                                onCancel={() => setModal2Open(false)}
                                footer={null}
                            >
                                <Button
                                    onClick={handleAddAddressClick}>{showAddAddress ? "Quay lại" : "Thêm địa chỉ"}</Button>
                                {/*{showAddAddress && <AddressCheckoutAdd />}*/}
                                {/*{!showAddAddress && (*/}
                                {/*    <Radio.Group className="w-full"*/}
                                {/*        defaultValue={ePage.content.find(item => item.id === currentUser.addressId)}*/}
                                {/*        onChange={(e: RadioChangeEvent) => setShippingAddress(e.target.value)}>*/}
                                {/*        <List*/}
                                {/*            dataSource={ePage.content}*/}
                                {/*            renderItem={(item: AddressAPIResponse, index: number) => (*/}
                                {/*                <Collapse*/}
                                {/*                    className="my-[16px]"*/}
                                {/*                    expandIconPosition={"end"}*/}
                                {/*                    collapsible={"icon"}*/}
                                {/*                    items={[{*/}
                                {/*                        key: item.id,*/}
                                {/*                        label: <Radio id={`radio-${item.id}`} value={item}>*/}
                                {/*                            <div><span*/}
                                {/*                                style={{ fontWeight: 'bold' }}>{item.fullName}</span> | {item.phoneNumber}*/}
                                {/*                            </div>*/}
                                {/*                            <div>{item.address}</div>*/}
                                {/*                        </Radio>,*/}
                                {/*                        children: <AddressCheckoutUpdate address={item} />*/}
                                {/*                    }]}*/}
                                {/*                />*/}
                                {/*            )}*/}
                                {/*        />*/}
                                {/*    </Radio.Group>*/}
                                {/*)}*/}
                            </Modal>
                        </div>
                        <div>
                            {shippingAddress && (
                                <>
                                    <div><span
                                        style={{fontWeight: 'bold'}}>{shippingAddress.fullName}</span> | {shippingAddress.phoneNumber}
                                    </div>
                                    <div><CardHome content="Nhà"/>{shippingAddress.address}</div>
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
                                    {/*{totalAmount}*/}0
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
                                    {/*{totalAmount}*/}0
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
                        onFinish={addMultipleOrders}
                    >
                        <Form.Item
                            name="note"
                        >
                            <TextArea placeholder="Ghi chú" allowClear/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" danger block
                                    disabled={carts.page.content.length == 0}>
                                Thanh toán
                            </Button>

                        </Form.Item>
                    </Form>

                </Col>
            </Row>
        </div>
    );

}