import {Avatar, Button, Dropdown, MenuProps} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {LogoutOutlined, QuestionCircleOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {useEffect} from "react";
import {RootState} from "@/redux/store.ts";
import {Link, useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {REFRESH_TOKEN, server} from "@/utils/server.ts";
import {clearCurrentUser} from "@/redux/modules/auth.ts";
import SearchKeyword from "@/components/searchKeyword.tsx";
import MenuMobile from "@/components/menu-mobile.tsx";
import Cart from "@/components/organisms/cart.tsx";

// let sock: WebSocket | null = null;
export default function HeaderMain() {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <span id='account-information' onClick={() => handleItemClick('/account-information')}
                      className="flex w-full h-full">
                    <span style={{marginRight: '5px'}}>
                        <UserOutlined/>
                    </span>
                    <div className="w-full">Thông tin tài khoản</div>
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span id='your-orders' onClick={() => handleItemClick('/orders')} className="flex w-full h-full">
                    <span style={{marginRight: '5px'}}>
                        <ShoppingOutlined/>
                    </span>
                    <div className="w-full">Đơn hàng của bạn</div>
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span id='aaa' onClick={() => handleItemClick('/')} className="flex w-full h-full">
                    <span style={{marginRight: '5px'}}>
                        <QuestionCircleOutlined/>
                    </span>
                    <div className="w-full">Trung tâm hỗ trợ</div>
                </span>
            ),
        },
        {
            key: '4',
            label: (
                <span id='logout' onClick={() => handleItemClick('/login')} className="flex w-full h-full">
                    <span style={{marginRight: '5px'}}>
                        <LogoutOutlined/>
                    </span>
                    <div className="w-full">Đăng xuất</div>
                </span>
            ),
        },
    ];

    const handleItemClick = (path: string): void => {
        if (currentUser.id) {
            if (path === '/login') {
                Cookies.remove(REFRESH_TOKEN);
                dispatch(clearCurrentUser());
                setTimeout(() => {
                    window.location.href = path;
                }, 0);
            }
            navigate(path);
        } else {
            Cookies.remove(REFRESH_TOKEN);
            navigate('/login');
        }
    };

    // const getShippingAddress = (): void => {
    //     const addressId: string = currentUser.addressId ?? "";
    //
    //     if (addressId !== "" && Cookies.get(REFRESH_TOKEN)) {
    //         getAddressById(addressId, { refreshToken: Cookies.get(REFRESH_TOKEN) })
    //             .then(res => {
    //                 dispatch(setCurrentShippingAddress(res));
    //             })
    //             .catch(res => {
    //                 console.log("Shipping address message: ", res.message);
    //             });
    //     }
    // };

    useEffect(() => {
        // getShippingAddress();
    }, [currentUser]);

    // useEffect(() => {
    //     const refreshToken = Cookies.get(REFRESH_TOKEN);
    //     if (refreshToken) {
    //         if (!currentUser.id) {
    //             const user: CurrentUser = jwtDecode(refreshToken);
    //             getUserById(user.id)
    //                 .then(res => {
    //                     const userResponseDTO: UserAPIResponse = res;
    //                     const currentUser: CurrentUser = {
    //                         id: userResponseDTO.id,
    //                         sub: userResponseDTO.id,
    //                         role: userResponseDTO.role,
    //                         avatar: userResponseDTO.avatar,
    //                         addressId: userResponseDTO.address.id,
    //                         username: userResponseDTO.username,
    //                         email: userResponseDTO.email
    //                     };
    //                     dispatch(setCurrentUser(currentUser));
    //                 });
    //         }
    //
    //         if (!sock) {
    //             console.log("Connect to socket successfully..." + currentUser.id);
    //             sock = new SockJS(server + "/notification-register?client-id=" + currentUser.id);
    //
    //             const client = new Client({
    //                 webSocketFactory: () => sock,
    //                 onConnect: () => {
    //                     client.subscribe('/topic/global-notifications', (message: IMessage) => {
    //                         const notificationResponse: NotificationAPIResponse = JSON.parse(message.body);
    //                         dispatch(addNotification(notificationResponse));
    //                         notification.open({
    //                             type: "success",
    //                             placement: 'bottomRight',
    //                             message: notificationResponse.fromUser.address.fullName,
    //                             description: notificationResponse.message,
    //                             btn: (
    //                                 <Button type="primary" onClick={() => console.log("Click vao thong bao")}>
    //                                     Xem ngay
    //                                 </Button>
    //                             )
    //                         });
    //                     });
    //                     client.subscribe('/user/topic/client-notifications', (message) => {
    //                         const notificationResponse: NotificationAPIResponse = JSON.parse(message.body);
    //                         dispatch(addNotification(notificationResponse));
    //                         notification.open({
    //                             type: "success",
    //                             placement: 'bottomRight',
    //                             message: notificationResponse.fromUser.address.fullName,
    //                             description: notificationResponse.message,
    //                             btn: (
    //                                 <Button type="primary" onClick={() => console.log("Click vao thong bao")}>
    //                                     Xem ngay
    //                                 </Button>
    //                             )
    //                         });
    //                     });
    //                 },
    //                 onStompError: (frame) => {
    //                     console.log("Error connecting to Websocket server", frame)
    //                 }
    //             });
    //             client.activate();
    //         }
    //     }
    // }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] px-2 mx-auto items-center py-2 gap-4 max-w-screen-xl">
            <div className="flex items-center justify-between md:justify-start">
                <MenuMobile/>

                <div onClick={() => window.location.href = "/"}
                    className="flex items-center gap-1 nunito text-3xl md:text-4xl text-orange-400 cursor-pointer hover:text-orange-500">
                    <img src="/logo-02.png" className="w-10 h-10 md:w-14 md:h-14" alt="FoodPoni Logo"/>
                    <div className="md:block">FoodPoni</div>
                </div>

            </div>
            <div className="grid grid-cols-1 grid-cols-[2fr_1fr] items-center gap-4">
                <div className="order-3 md:order-2 mt-4 md:mt-0">
                    <SearchKeyword/>
                </div>
                <div className='flex items-center justify-end gap-4 order-2 md:order-3'>
                    {!currentUser.id ? (
                            <>
                                <Cart />
                                {/*<Notification />*/}
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
                                        <div
                                            className="text-gray-500 text-[15px] hidden md:block">{currentUser.username}</div>
                                    </a>
                                </Dropdown>
                            </>
                        )
                        : (
                            <Button type='primary' onClick={() => navigate('/auth/login')} icon={<UserOutlined/>}
                                    size='large'>
                                <span className="hidden md:inline">Đăng nhập</span>
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}