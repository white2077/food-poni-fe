import {Avatar, Button, Col, Dropdown, Flex, MenuProps, Row,} from 'antd';
import CartComponent from './cart';
import SearchComponent from './search';
import {useSelector} from 'react-redux';
import {LogoutOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {NextRouter, useRouter} from 'next/router';
import {RootState} from '../store';
import React from "react";
import {CurrentUser} from "../store/user.reducer";

const MainHeader = () => {

    const router: NextRouter = useRouter();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span id='account-information' onClick={() => handleItemClick('/account-information')}>
                    <span style={{marginRight: '5px'}}>
                        <UserOutlined />
                    </span>
                    <span>Account management</span>
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span id='your-orders' onClick={() => handleItemClick('/orders')}>
                    <span style={{marginRight: '5px'}}>
                        <ShoppingOutlined/>
                    </span>
                    <span>Your orders</span>
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span id='logout' onClick={() => handleItemClick('/login')}>
                    <span style={{marginRight: '5px'}}>
                        <LogoutOutlined/>
                    </span>
                    <span>Logout</span>
                </span>
            ),
        },
    ];

    const handleItemClick = (path: string): void => {
        router.push(path);
    };

    return (
        <Row style={{maxWidth: '1440px', margin: '0 auto'}} align='middle'>
            <Col span={6}>
                <Button type='link' style={{
                    verticalAlign: 'middle',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    height: 'unset'
                }} onClick={() => router.push('/')}>Foodponi</Button>
            </Col>
            <Col span={12}>
                <SearchComponent></SearchComponent>
            </Col>
            <Col span={6}>
                <Flex gap='middle' align='center' justify='end'>
                    <CartComponent></CartComponent>
                    {/*<a onClick={showDrawer}>*/}
                    {/*    <Avatar shape="square" icon={<ShoppingCartOutlined/>} size='large'/>*/}
                    {/*</a>*/}
                    <Dropdown menu={{items}} placement='bottomRight'>
                        <a style={{verticalAlign: 'middle'}}>
                            {currentUser.avatar ? (
                                <Avatar src={currentUser.avatar} size='large'/>
                            ) : (
                                <Avatar icon={<UserOutlined/>} size='large'/>
                            )}
                        </a>
                    </Dropdown>
                </Flex>
            </Col>
        </Row>
    );

};

export default MainHeader;