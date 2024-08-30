import { Avatar, Button, Dropdown, MenuProps, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutOutlined, QuestionCircleOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { NextRouter, useRouter } from 'next/router';
import { RootState } from '../stores';
import React, { useEffect } from "react";
import { CurrentUser, setCurrentUser } from "../stores/user.reducer";
import Cart from "./cart";
import SearchKeyword from "./search-keyword";
import { deleteCookie, getCookie } from "cookies-next";
import { REFRESH_TOKEN, server } from "../utils/server";
import Notification from "./notification";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { addNotification } from "../stores/notification.reducer";
import { NotificationAPIResponse } from "../models/notification/NotificationAPIResponse";
import jwtDecode from "jwt-decode";
import { accessToken, api, apiWithToken } from "../utils/axios-config";
import { AxiosError, AxiosResponse } from "axios";
import { AddressAPIResponse } from "../models/address/AddressAPIResponse";
import { setCurrentShippingAddress } from "../stores/address.reducer";
import Link from "next/link";
import MenuMobile from "./menu-mobile";
import { UserAPIResponse } from "../models/user/UserAPIResponse";
import { ErrorAPIResponse } from "../models/ErrorAPIResponse";
import { getAddressById } from "../queries/address.query";
import { getUserById } from "../queries/user.query";


let sock: any = null;
export default function HeaderMain() {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const refreshToken = getCookie(REFRESH_TOKEN);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span id='account-information' onClick={() => handleItemClick('/account-information')} className="flex w-full h-full">
                    <span style={{ marginRight: '5px' }}>
                        <UserOutlined />
                    </span>
                    <div className="w-full">Thông tin tài khoản</div>
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span id='your-orders' onClick={() => handleItemClick('/orders')} className="flex w-full h-full">
                    <span style={{ marginRight: '5px' }}>
                        <ShoppingOutlined />
                    </span>
                    <div className="w-full">Đơn hàng của bạn</div>
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span id='aaa' onClick={() => handleItemClick('/')} className="flex w-full h-full">
                    <span style={{ marginRight: '5px' }}>
                        <QuestionCircleOutlined />
                    </span>
                    <div className="w-full">Trung tâm hỗ trợ</div>
                </span>
            ),
        },
        {
            key: '4',
            label: (
                <span id='logout' onClick={() => handleItemClick('/login')} className="flex w-full h-full">
                    <span style={{ marginRight: '5px' }}>
                        <LogoutOutlined />
                    </span>
                    <div className="w-full">Đăng xuất</div>
                </span>
            ),
        },
    ];

    const handleItemClick = (path: string): void => {
        if (currentUser.id) {
            if (path === '/login') {
                deleteCookie(REFRESH_TOKEN);
                dispatch(setCurrentUser({} as CurrentUser));
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

    const getShippingAddress = (): void => {
        const addressId: string = currentUser.addressId ?? "";

        if (addressId !== "" && refreshToken) {
            getAddressById(addressId, { refreshToken: refreshToken })
                .then(res => {
                    dispatch(setCurrentShippingAddress(res));
                })
                .catch(res => {
                    console.log("Shipping address message: ", res.message);
                });
        }
    };

    useEffect(() => {
        getShippingAddress();
    }, [currentUser]);

    useEffect(() => {
        if (refreshToken) {
            if (!currentUser.id) {
                const user: CurrentUser = jwtDecode(refreshToken);
                getUserById(user.id)
                    .then(res => {
                        const userResponseDTO: UserAPIResponse = res;
                        const currentUser: CurrentUser = {
                            id: userResponseDTO.id,
                            sub: userResponseDTO.id,
                            role: userResponseDTO.role,
                            avatar: userResponseDTO.avatar,
                            addressId: userResponseDTO.address.id,
                            username: userResponseDTO.username,
                            email: userResponseDTO.email
                        };
                        dispatch(setCurrentUser(currentUser));
                    });
            }

            if (!sock) {
                console.log("Connect to socket successfully..." + currentUser.id);
                sock = new SockJS(server + "/notification-register?client-id=" + currentUser.id);

                const client = new Client({
                    webSocketFactory: () => sock,
                    onConnect: () => {
                        client.subscribe('/topic/global-notifications', (message: IMessage) => {
                            const notificationResponse: NotificationAPIResponse = JSON.parse(message.body);
                            dispatch(addNotification(notificationResponse));
                            notification.open({
                                type: "success",
                                placement: 'bottomRight',
                                message: notificationResponse.fromUser.address.fullName,
                                description: notificationResponse.message,
                                btn: (
                                    <Button type="primary" onClick={() => console.log("Click vao thong bao")}>
                                        Xem ngay
                                    </Button>
                                )
                            });
                        });
                        client.subscribe('/user/topic/client-notifications', (message: any) => {
                            const notificationResponse: NotificationAPIResponse = JSON.parse(message.body);
                            dispatch(addNotification(notificationResponse));
                            notification.open({
                                type: "success",
                                placement: 'bottomRight',
                                message: notificationResponse.fromUser.address.fullName,
                                description: notificationResponse.message,
                                btn: (
                                    <Button type="primary" onClick={() => console.log("Click vao thong bao")}>
                                        Xem ngay
                                    </Button>
                                )
                            });
                        });
                    },
                    onStompError: (frame) => {
                        console.log("Error connecting to Websocket server", frame)
                    }
                });
                client.activate();
            }
        }
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] px-2 mx-auto items-center py-2 gap-4 max-w-screen-xl">
            <div className="flex items-center justify-between md:justify-start">
                <MenuMobile />
                <Link href="/">
                    <div className="flex items-center gap-1 nunito text-3xl md:text-4xl text-orange-400 cursor-pointer hover:text-orange-500">
                        <img src="/logo-02.png" className="w-10 h-10 md:w-14 md:h-14" alt="FoodPoni Logo" />
                        <div className="md:block">FoodPoni</div>
                    </div>
                </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
                <div className="order-3 md:order-2 mt-4 md:mt-0">
                    <SearchKeyword />
                </div>
                <div className='flex items-center justify-end gap-4 order-2 md:order-3'>
                    {currentUser.id ? (
                        <>
                            <Cart />
                            <Notification />
                            <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']}
                                className="hover:bg-gray-200 rounded-lg p-1.5 cursor-pointer h-[100%] ">
                                <a className="gap-1 flex items-center">
                                    <div>
                                        {currentUser.avatar
                                            ? <Avatar
                                                className="w-8 h-8 rounded-[100%] border-orange-400 border-2"
                                                src={server + currentUser.avatar} />
                                            : <Avatar icon={<UserOutlined />} size='large' />}
                                    </div>
                                    <div className="text-gray-500 text-[15px] hidden md:block">Tài khoản</div>
                                </a>
                            </Dropdown>
                        </>
                    )
                        : (
                            <Button type='primary' onClick={() => router.push('/login')} icon={<UserOutlined />}
                                size='large'>
                                <span className="hidden md:inline">Đăng nhập</span>
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    );

};