import {Avatar, Col, Dropdown, Flex, MenuProps, Row} from "antd";
import Link from "next/link";
import CartComponent from "./cart";
import SearchComponent from "./search";
import {useSelector} from "react-redux";
import {ICurrentUser} from "../store/user.reducer";
import {LogoutOutlined, ShoppingOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";

const MainHeader = () => {

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span onClick={() => handleItemClick('/orders')}>
                    <span style={{ marginRight: '5px' }}>
                        <ShoppingOutlined />
                    </span>
                    <span>Your orders</span>
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span onClick={() => handleItemClick('/login')}>
                    <span style={{ marginRight: '5px' }}>
                        <LogoutOutlined />
                    </span>
                    <span>Logout</span>
                </span>
            ),
        },
    ];

    const router = useRouter();

    const currentUser = useSelector(state => state.user.currentUser) as ICurrentUser;

    const handleItemClick = (path) => {
        router.push(path);
    };

    return (
        <Row align='middle'>
            <Col flex={2}>
                <Link href={'/'} style={{
                    verticalAlign: 'middle',
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
                    <Dropdown menu={{ items }} placement="bottomRight" arrow>
                        <Avatar src={currentUser.avatar} style={{ verticalAlign: 'middle' }} size="large" />
                    </Dropdown>
                </Flex>
            </Col>
        </Row>
    )
}

export default MainHeader