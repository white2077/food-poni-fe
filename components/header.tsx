import Search from "antd/lib/input/Search";
import {Avatar, Col, Flex, Row} from "antd";
import {useState} from "react";
import Link from "next/link";
import CartComponent from "./cart";
import SearchComponent from "./search";

const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

const MainHeader = () => {
    const [user, setUser] = useState(UserList[0]);
    const [color, setColor] = useState(ColorList[0]);

    return (
        <Row align='middle'>
            <Col flex={2}>
                <Link href={'/'} style={{
                    verticalAlign: 'middle',
                    color: color,
                    fontWeight: 'bold',
                    fontSize: '24px'
                }}>Foodponi</Link>
            </Col>
            <Col flex={3}>
                <SearchComponent></SearchComponent>
            </Col>
            <Col flex={2}>
                <Flex gap='middle' align='center' justify='end'>
                        <CartComponent></CartComponent>
                        <Avatar style={{backgroundColor: color, verticalAlign: 'middle'}} size="large">
                            {user}
                        </Avatar>
                </Flex>
            </Col>
        </Row>
    )
}

export default MainHeader