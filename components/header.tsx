import Search from "antd/lib/input/Search";
import {Avatar, Col, Row} from "antd";
import {useState} from "react";

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

const MainHeader = () => {
    const [user, setUser] = useState(UserList[0]);
    const [color, setColor] = useState(ColorList[0]);

    return (
        <Row>
            <Col flex={2}>
                <div style={{ verticalAlign: 'middle', color: color }}>Foodponi</div>
            </Col>
            <Col flex={3}>
                <Search placeholder="input search text" enterButton="Search" size="large" loading={false} style={{ verticalAlign: 'middle' }}/>
            </Col>
            <Col flex={2}>
                <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }} size="large">
                    {user}
                </Avatar>
            </Col>
        </Row>
    )
}

export default MainHeader