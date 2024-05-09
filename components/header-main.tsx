import {Avatar, Button, Dropdown, MenuProps,} from 'antd';
import {useSelector} from 'react-redux';
import {LogoutOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {NextRouter, useRouter} from 'next/router';
import {RootState} from '../stores';
import React from "react";
import {CurrentUser} from "../stores/user.reducer";
import Cart from "./cart";
import SearchKeyword from "./search-keyword";
import {getAccessToken} from "../utils/auth";

const HeaderMain = () => {

    const router: NextRouter = useRouter();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span id='account-information' onClick={() => handleItemClick('/account-information')}>
                    <span style={{marginRight: '5px'}}>
                        <UserOutlined/>
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
        if (getAccessToken()) {
            router.push(path);
        } else {
            router.push('/login');
        }
    };

    return (
        <div className='lg:w-[1440px] grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr] px-2 mx-auto items-center py-2 gap-4'>
            <a className='font-bold text-2xl h-[unset]' onClick={() => router.push('/')}>FoodPoni</a>
            <SearchKeyword/>
            <div className='flex items-center justify-end gap-4'>
                {currentUser.id ? (
                        <>
                            <Cart/>
                            <Dropdown menu={{items}} placement='bottomRight'>
                                <a>
                                    {currentUser.avatar
                                        ? <Avatar src={currentUser.avatar} size='large'/>
                                        : <Avatar icon={<UserOutlined/>} size='large'/>}
                                </a>
                            </Dropdown>
                        </>
                    )
                    : <Button type='primary' onClick={() => router.push('/login')} icon={<UserOutlined/>}
                              size='large'>Sign In
                    </Button>
                }
            </div>
        </div>
    );

};

export default HeaderMain;