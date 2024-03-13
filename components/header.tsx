import Search from "antd/lib/input/Search";
import {Col, Row} from "antd";

const MainHeader = () => {
    return (
        <Row>
            <Col flex={2}>2 / 5</Col>
            <Col flex={3}>
                <Search placeholder="input search text" enterButton="Search" size="large" loading={false}/>
            </Col>
            <Col flex={2}>3 / 5</Col>
        </Row>
    )
}

export default MainHeader