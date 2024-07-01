import {Avatar, Button, Dropdown, MenuProps,} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {LogoutOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {NextRouter, useRouter} from 'next/router';
import {RootState} from '../stores';
import React, {useEffect} from "react";
import {CurrentUser, setCurrentUser} from "../stores/user.reducer";
import Cart from "./cart";
import SearchKeyword from "./search-keyword";
import {deleteCookie, getCookie} from "cookies-next";
import {REFRESH_TOKEN, server} from "../utils/server";
import Notification from "./notification";
import {INITIAL_PAGE_API_RESPONSE} from "../models/Page";
import SockJS from "sockjs-client";
import {Client, IMessage} from "@stomp/stompjs";
import {addNotification} from "../stores/notification.reducer";
import {NotificationAPIResponse} from "../models/notification/NotificationResponseAPI";
import jwtDecode from "jwt-decode";

let sock: any = null;

const HeaderMain = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const refreshToken = getCookie(REFRESH_TOKEN);

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
        if (currentUser.id) {
            if (path === '/login') {
                deleteCookie(REFRESH_TOKEN);
                dispatch(setCurrentUser({}));
                setTimeout(() => {
                    window.location.href = path;
                }, 0);
            }
            router.push(path);
        } else {
            deleteCookie(REFRESH_TOKEN);
            router.push('/login');
        }
    };

    const changeCurrentUser = (refreshToken: string): void => {
        const payload: CurrentUser = jwtDecode(refreshToken);
        dispatch(setCurrentUser(payload));
    }

    useEffect(() => {
        if (refreshToken) {
            changeCurrentUser(refreshToken);
        }

        if (!sock) {
            console.log("Connect to socket successfully...");
            sock = new SockJS(server + "/notification-register?client-id=e3a57bd0-fa44-45ae-93ac-d777e480aa1a");

            const client = new Client({
                webSocketFactory: () => sock,
                onConnect: () => {
                    client.subscribe('/topic/global-notifications', (message: IMessage) => {
                        dispatch(addNotification(JSON.parse(message.body) as NotificationAPIResponse));
                    });
                    client.subscribe('/user/topic/client-notifications', (message: any) => {
                        dispatch(addNotification(JSON.parse(message.body) as NotificationAPIResponse));
                    });
                },
                onStompError: (frame: any) => {
                    console.log("Error connecting to Websocket server", frame)
                }
            });
            client.activate();
        }
    }, []);

    return (
        <div className='lg:w-[1440px] grid grid-cols-2 md:grid-cols-[1fr_2fr_1fr] px-2 mx-auto items-center py-2 gap-4'>
            <a className='font-bold text-2xl h-[unset] cu' onClick={() => router.push('/')}>FoodPoni</a>
            <SearchKeyword/>
            <div className='flex items-center justify-end gap-4'>
                {currentUser.id ? (
                        <>
                            <Cart/>
                            <Notification ePage={INITIAL_PAGE_API_RESPONSE} />
                            <Dropdown menu={{items}} placement='bottomRight' trigger={['click']}>
                                <a>
                                    {currentUser.avatar
                                        ? <Avatar src={server + currentUser.avatar} size='large'/>
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