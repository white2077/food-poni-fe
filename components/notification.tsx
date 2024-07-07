import React, {useEffect} from "react";
import {Avatar, Badge, Card, Dropdown, Menu} from 'antd';
import {BellOutlined} from "@ant-design/icons";
import {Page} from "../models/Page";
import {NotificationAPIResponse} from "../models/notification/NotificationResponseAPI";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {REFRESH_TOKEN, server} from "../utils/server";
import {format} from "date-fns";
import {getCookie} from "cookies-next";
import {RootState} from "../stores";
import {useDispatch, useSelector} from "react-redux";
import {markIsReadNotification, setNotifications} from "../stores/notification.reducer";

const Notification = ({ePage}: { ePage: Page<NotificationAPIResponse> }) => {

    const dispatch = useDispatch();

    const notification = useSelector((state: RootState) => state.notification);

    useEffect(() => {
        const refreshToken = getCookie(REFRESH_TOKEN);
        if (refreshToken) {
            apiWithToken(refreshToken).get('/notifications', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then((res: AxiosResponse<Page<NotificationAPIResponse[]>>) => {
                dispatch(setNotifications(res.data.content));
            })
        }
    }, []);

    const items = notification.data.length > 0 ? (
        <>
            <div className="rounded-lg">
                <div className="bg-white py-3 px-6 text-xl font-bold rounded-t-lg">Thông báo</div>
                <Menu className="max-h-96 overflow-y-auto scrollbar-thin !rounded-none !rounded-b-lg !shadow-none">
                    {[...notification.data].sort((a: NotificationAPIResponse, b: NotificationAPIResponse) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
                        .map(
                        (noti: NotificationAPIResponse, index: number) => (
                            <Menu.Item key={index}
                                       onClick={() => {
                                           if (!noti.read) {
                                               dispatch(markIsReadNotification(noti.id));
                                               const refreshToken = getCookie(REFRESH_TOKEN);
                                               if (refreshToken) {
                                                   apiWithToken(refreshToken).patch("/notifications/update-read", {
                                                       id: noti.id,
                                                       read: true
                                                   }, {
                                                       headers: {
                                                           Authorization: "Bearer " + accessToken
                                                       }
                                                   });
                                               }
                                           }
                                       }}
                            >
                                <div
                                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-sm">
                                    <div className="relative w-10">
                                        <img
                                            className="flex-none rounded-full bg-gray-50 object-cover aspect-square"
                                            src={server + noti.fromUser.avatar}
                                            alt=""/>
                                    </div>
                                    <div className="flex-auto ms-3 text-sm font-normal">
                                        <p className="h-10 leading-5 line-clamp-2">
                                            <span
                                                className="font-semibold text-sm text-gray-900">{noti.fromUser.address.fullName}</span>{'\u00A0'}<span
                                            className="text-gray-600 text-sm">
                                            {noti.message}</span>
                                        </p>
                                        <p className={`mt-1 truncate text-xs leading-4 text-${noti.read ? "gray-500" : "primary"}`}>{format(noti.createdDate, "yyyy-MM-dd HH:mm:ss")}</p>
                                    </div>
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <div hidden={noti.read}
                                             className="w-2 h-2 bg-primary rounded-full"></div>
                                    </div>
                                </div>
                                <div className="my-2"></div>
                            </Menu.Item>
                        )
                    )}
                </Menu>
            </div>
        </>
    ) : (
        <>
            <div className="rounded-lg">
                <Menu className="max-h-96 overflow-y-auto scrollbar-thin rounded-b-lg shadow-none">
                    <Menu.Item key={0}>
                        <p className="font-semibold text-sm text-gray-900 text-center">Không có thông báo</p>
                    </Menu.Item>
                </Menu>
            </div>
        </>
    );

    return (
        <>
            <Dropdown overlay={items} placement="bottomRight" trigger={['click']}>
                <Badge count={notification.data.filter(item => !item.read).length > 0 ? notification.data.filter(item => !item.read).length : 0}>
                    <Avatar shape="square" icon={<BellOutlined/>} size="large"/>
                </Badge>
            </Dropdown>
        </>
    );

};

export default Notification;