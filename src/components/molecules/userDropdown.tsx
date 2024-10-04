import {Avatar, Dropdown, MenuProps} from "antd";
import {REFRESH_TOKEN, server} from "@/utils/server.ts";
import {LogoutOutlined, QuestionCircleOutlined, ShoppingOutlined, UserOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import Cookies from "js-cookie";

export function UserDropdown() {

    const {currentUser} = useSelector((state: RootState) => state.auth);

    const navigate = useNavigate();

    const items: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <span id="account-information" onClick={(): void => {
                    // if (currentUser.id) {
                    //     if (path === "/login") {
                    //         Cookies.remove(REFRESH_TOKEN);
                    //         dispatch(clearCurrentUser());
                    //         setTimeout(() => {
                    //             window.location.href = path;
                    //         }, 0);
                    //     }
                    //     navigate(path);
                    // } else {
                    //     Cookies.remove(REFRESH_TOKEN);
                    //     navigate("/login");
                    // }
                }}
                      className="flex w-full h-full">
                    <span style={{marginRight: "5px"}}>
                        <UserOutlined/>
                    </span>
                    <div className="w-full">Thông tin tài khoản</div>
                </span>
            ),
        },
        {
            key: "2",
            label: (
                <span id="your-orders" onClick={() => ("/orders")} className="flex w-full h-full">
                    <span style={{marginRight: "5px"}}>
                        <ShoppingOutlined/>
                    </span>
                    <div className="w-full">Đơn hàng của bạn</div>
                </span>
            ),
        },
        {
            key: "3",
            label: (
                <span id="aaa" onClick={() => ("/")} className="flex w-full h-full">
                    <span style={{marginRight: "5px"}}>
                        <QuestionCircleOutlined/>
                    </span>
                    <div className="w-full">Trung tâm hỗ trợ</div>
                </span>
            ),
        },
        {
            key: "4",
            label: (
                <span id="logout" onClick={() => {
                    Cookies.remove(REFRESH_TOKEN);
                    navigate("/");
                    window.location.reload();
                }} className="flex w-full h-full">
                    <span className="mr-4">
                        <LogoutOutlined/>
                    </span>
                    <div className="w-full">Đăng xuất</div>
                </span>
            ),
        },
    ];

    if (!currentUser) return;

    return (
        <Dropdown menu={{items}} placement="bottomRight" trigger={["click"]}
                  className="hover:bg-gray-200 rounded-lg p-1.5 cursor-pointer h-[100%] ">
            <a className="gap-1 flex items-center">
                {currentUser.avatar
                    ? <Avatar
                        className="w-8 h-8 rounded-[100%] border-orange-400 border-2 p-0"
                        src={server + currentUser.avatar}/>
                    : <Avatar icon={<UserOutlined/>}/>}
                <span className="text-gray-500 text-[15px] hidden md:block">{currentUser.username}</span>
            </a>
        </Dropdown>
    )
}