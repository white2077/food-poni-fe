import {Avatar, Button, Dropdown, MenuProps, notification} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {LogoutOutlined, QuestionCircleOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {NextRouter, useRouter} from 'next/router';
import {RootState} from '../stores';
import React, {useEffect} from "react";
import {CurrentUser, setCurrentUser} from "../stores/user.reducer";
import Cart from "./cart";
import SearchKeyword from "./search-keyword";
import {deleteCookie, getCookie} from "cookies-next";
import {REFRESH_TOKEN, server} from "../utils/server";
import Notification from "./notification";
import SockJS from "sockjs-client";
import {Client, IMessage} from "@stomp/stompjs";
import {addNotification} from "../stores/notification.reducer";
import {NotificationAPIResponse} from "../models/notification/NotificationAPIResponse";
import jwtDecode from "jwt-decode";
import {accessToken, api, apiWithToken} from "../utils/axios-config";
import {AxiosError, AxiosResponse} from "axios";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {setCurrentShippingAddress} from "../stores/address.reducer";
import {ErrorApiResponse} from "../models/ErrorApiResponse";
import Link from "next/link";
import MenuMobile from "./menu-mobile";
import {UserAPIResponse} from "../models/user/UserAPIResponse";
import ThemeSwitch from "./theme";

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
                <span id='account-information' onClick={() => handleItemClick('/account-information')}>
                    <span style={{marginRight: '5px'}}>
                        <UserOutlined/>
                    </span>
                    <span>Thông tin tài khoản</span>
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
                    <span>Đơn hàng của bạn</span>
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span id='aaa' onClick={() => handleItemClick('/')}>
                    <span style={{marginRight: '5px'}}>
                        <QuestionCircleOutlined/>
                    </span>
                    <span>Trung tâm hỗ trợ</span>
                </span>
            ),
        },
        {
            key: '4',
            label: (
                <span id='logout' onClick={() => handleItemClick('/login')}>
                    <span style={{marginRight: '5px'}}>
                        <LogoutOutlined/>
                    </span>
                    <span>Đăng xuất</span>
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
            apiWithToken(refreshToken).get(`/addresses/${addressId}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function (res: AxiosResponse<AddressAPIResponse>): void {
                    dispatch(setCurrentShippingAddress(res.data));
                })
                .catch(function (res: AxiosError<ErrorApiResponse>): void {
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
                api.get("/users/" + user.id)
                    .then(function (res) {
                        const userResponseDTO: UserAPIResponse = res.data;
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
                    })
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
        <div className="grid grid-cols-[1fr_2fr_1fr] px-2 mx-auto items-center py-2 gap-4 max-w-screen-xl">
            <MenuMobile/>
            <ThemeSwitch/>
            <Link href="/" >
               <div className="font-['Impact','fantasy'] text-4xl text-orange-400 cursor-pointer hover:text-orange-500">FoodPoni</div>
            </Link>
            <SearchKeyword/>
            <div className='flex items-center justify-end gap-4'>
                {currentUser.id ? (
                        <>
                            <Cart/>
                            <Notification/>
                            <Dropdown menu={{items}} placement='bottomRight' trigger={['click']}
                                      className="hover:bg-gray-200 rounded-lg p-1.5 cursor-pointer h-[100%] ">
                                <a className="gap-1 flex items-center">
                                   <div>
                                       {currentUser.avatar
                                           ? <Avatar
                                               className="w-8 h-8 rounded-[100%] border-orange-400 border-2"
                                               src={server + currentUser.avatar}/>
                                           : <Avatar icon={<UserOutlined/>} size='large'/>}
                                   </div>
                                    <div className="text-gray-500 text-[15px]">Tài khoản</div>
                                </a>
                            </Dropdown>
                        </>
                    )
                    : (
                        <Button type='primary' onClick={() => router.push('/login')} icon={<UserOutlined/>}
                                size='large'>
                            Đăng nhập
                        </Button>
                    )
                }
            </div>
        </div>
    );

};