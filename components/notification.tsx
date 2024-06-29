import React, {useEffect} from "react";
import {Avatar, Badge, Dropdown, Menu} from 'antd';
import {BellOutlined} from "@ant-design/icons";
import {Page} from "../models/Page";
import {NotificationAPIResponse} from "../models/notification/NotificationResponseAPI";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {REFRESH_TOKEN, server} from "../utils/server";
import {format} from "date-fns";
import {getCookie} from "cookies-next";
import store, {RootState} from "../stores";
import {useDispatch, useSelector} from "react-redux";
import {setNotifications} from "../stores/notification.reducer";

const Notification = ({ePage}: { ePage: Page<NotificationAPIResponse> }) => {

    const dispatch = useDispatch();

    const notification = useSelector((state: RootState) => state.notification);

    useEffect(() => {
        const refreshToken = getCookie(REFRESH_TOKEN);
        if (refreshToken) {
            apiWithToken(store.dispatch, refreshToken).get('/notifications', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then((res: AxiosResponse<Page<NotificationAPIResponse[]>>) => {
                console.log(res.data.content);
                dispatch(setNotifications(res.data.content));
            })
        }
    }, []);

    const menu = (
        <div className="rounded-lg">
            <div className="bg-white px-4 py-4 text-2xl font-bold">Notifications</div>
            <Menu className="max-h-96 overflow-y-auto scrollbar-thin rounded-b-lg shadow-none">
                {notification.data.map(
                    (notification: NotificationAPIResponse, index: number) => (
                        <Menu.Item key={index}>
                            <div
                                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-sm">
                                <div className="relative w-20">
                                    <img className="flex-none rounded-full bg-gray-50 object-cover aspect-square"
                                         src={server + notification.fromUser.avatar}
                                         alt=""/>
                                </div>
                                <div className="min-w-0 flex-auto">
                                    <p className="leading-5">
                                            <span
                                                className="font-semibold text-sm text-gray-900">{notification.fromUser.address?.fullName ? notification.fromUser.address.fullName : ""}</span>
                                        <span className="text-gray-600 text-sm"> {notification.message}</span>
                                    </p>
                                    <p className={`mt-1 truncate text-xs leading-4 text-${notification.isRead ? "gray-500" : "primary"}`}>{format(notification.createdDate, "yyyy-MM-dd HH:mm:ss")}</p>
                                </div>
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <div hidden={notification.isRead}
                                         className="w-2 h-2 bg-primary rounded-full"></div>
                                </div>
                            </div>
                            <div className="my-2"></div>
                        </Menu.Item>
                    )
                )}
            </Menu>
        </div>
    );

    return (
        <>
            <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
                <Badge count={notification.data.length > 0 ? notification.data.length : 0}>
                    <Avatar shape="square" icon={<BellOutlined/>} size="large"/>
                </Badge>
            </Dropdown>
        </>
    );

};

export default Notification;