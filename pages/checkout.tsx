import {DefaultLayout} from "../components/layout";
import {Card, Checkbox, Col, Row, Space} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

const Checkout = () => {
    return (
        <DefaultLayout>
            <div style={{color: "black", textAlign: "left"}}>
                <h1>GIỎ HÀNG</h1>
                <Row gutter={16}>
                    <Col flex={3}>
                        <Card style={{marginBottom: "16px"}}>
                            <Row>
                                <Col flex='5%'><Checkbox></Checkbox></Col>
                                <Col flex='40%'>Tất cả</Col>
                                <Col flex='15%'>Đơn giá</Col>
                                <Col flex='10%'>Số lượng</Col>
                                <Col flex='15%'>Thành tiền</Col>
                                <Col flex='5%'><DeleteOutlined /></Col>
                            </Row>
                        </Card>
                        <Card>
                            <Row>
                                <Col flex='5%'><Checkbox></Checkbox></Col>
                                <Col flex='40%'>Tất cả</Col>
                                <Col flex='15%'>Đơn giá</Col>
                                <Col flex='10%'>Số lượng</Col>
                                <Col flex='15%'>Thành tiền</Col>
                                <Col flex='5%'><DeleteOutlined /></Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col flex={1}>
                        <Card style={{marginBottom: "16px"}}>
                            1 / 4
                        </Card>
                        <Card>
                            1 / 4
                        </Card>
                    </Col>
                </Row>
            </div>
        </DefaultLayout>
    )
}

export default Checkout