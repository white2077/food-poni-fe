import {DefaultLayout} from "../components/layout";
import {Button, Card, Checkbox, Col, Divider, Row, Space} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {ICartItem} from "../store/cart.reducer";
import {CurrentUser} from "../model/User";

const Checkout = () => {

    const dispatch = useDispatch();

    const cartItems = useSelector(state => state.cart.cartItems) as ICartItem[];

    const currentUser = useSelector(state => state.user.currentUser) as CurrentUser;

    return (
        <DefaultLayout>
            <div style={{color: "black", textAlign: "left"}}>
                <h1>GIỎ HÀNG</h1>
                <Row gutter={16}>
                    <Col flex='auto'>
                        <Card style={{marginBottom: "16px"}}>
                            <Row>
                                <Col flex='5%'><Checkbox></Checkbox></Col>
                                <Col flex='40%'>Tất cả</Col>
                                <Col flex='15%'>Đơn giá</Col>
                                <Col flex='10%'>Số lượng</Col>
                                <Col flex='15%'>Thành tiền</Col>
                                <Col flex='5%'><DeleteOutlined/></Col>
                            </Row>
                        </Card>
                        <Card>
                            <Row>
                                <Col flex='5%'><Checkbox></Checkbox></Col>
                                <Col flex='40%'>Tất cả</Col>
                                <Col flex='15%'>Đơn giá</Col>
                                <Col flex='10%'>Số lượng</Col>
                                <Col flex='15%'>Thành tiền</Col>
                                <Col flex='5%'><DeleteOutlined/></Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col flex='450px'>
                        <Card style={{marginBottom: "16px"}}>
                            <div>
                                Giao tới
                                <a style={{float: 'right'}} href="">Thay đổi</a>
                            </div>
                            <div>
                                <div>Luu Thi Hai Yen | 0326207815</div>
                                <div>Tòa ViwaSeen 48 Tố Hữu, Phường Trung Văn, Quận Nam Từ Liêm, Hà Nội</div>
                            </div>
                        </Card>
                        <Card style={{marginBottom: "16px"}}>
                            <div>
                                Tạm tính
                                <span style={{float: 'right'}}>0</span>
                            </div>
                            <div>
                                Giảm giá
                                <span style={{float: 'right'}}>0</span>
                            </div>
                            <Divider/>
                            <div>
                                Tổng tiền
                                <span style={{float: 'right'}}>0</span>
                            </div>
                        </Card>
                        <Button type="primary" danger block>Thanh toán</Button>
                    </Col>
                </Row>
            </div>
        </DefaultLayout>
    )
}

export default Checkout