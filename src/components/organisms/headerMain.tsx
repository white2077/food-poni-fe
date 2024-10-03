import {useSelector} from 'react-redux';
import {useEffect} from "react";
import {RootState} from "@/redux/store.ts";
import SearchKeyword from "@/components/searchKeyword.tsx";
import MenuMobile from "@/components/menu-mobile.tsx";
import {UserDropdown} from "@/components/molecules/userDropdown.tsx";

// let sock: WebSocket | null = null;
export default function HeaderMain() {
    // const navigate = useNavigate();
    //
    // const dispatch = useDispatch();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);


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
                <UserDropdown/>
            </div>
        </div>
    );
}