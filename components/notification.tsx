import React, {useEffect} from "react";
import {Avatar, Badge, Button, Dropdown, notification, Tabs} from 'antd';
import {BellOutlined} from "@ant-design/icons";
import {Page} from "../models/Page";
import {NotificationAPIResponse} from "../models/notification/NotificationResponseAPI";
import {RootState} from "../stores";
import {useDispatch, useSelector} from "react-redux";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN, server} from "../utils/server";
import {AxiosError} from "axios";
import {markIsReadNotification, setNotifications} from "../stores/notification.reducer";
import {getNotificationsPageByCustomer} from "../queries/notification.query";
import {ErrorApiResponse} from "../models/ErrorApiResponse";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {format, formatDistanceToNow} from "date-fns";

const Notification = () => {

    const dispatch = useDispatch();

    const noti = useSelector((state: RootState) => state.notification);

    useEffect(() => {
        getNotificationsPageByCustomer(getCookie(REFRESH_TOKEN))
            .then((res: Page<NotificationAPIResponse[]>) => {
                dispatch(setNotifications(res.content))
            })
            .catch((res: AxiosError<ErrorApiResponse>) => {
                if (res.response) {

                } else {
                    notification.open({
                        type: 'error',
                        message: res.code,
                        description: res.message,
                    });
                }
                dispatch(setNotifications([]))
            })
    }, []);

    console.log(noti)

    return (
        <>
            <Dropdown dropdownRender={() => (
                <div className="w-[500px] shadow border rounded-lg bg-white">
                    <div className="flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5">Thông báo
                    </div>
                    <div className="border-b border-b-gray-200"></div>
                    <div className="px-5 mb-2">
                        <Tabs defaultActiveKey="1" items={
                            [
                                {
                                    key: '1',
                                    label: 'Tất cả',
                                    children:
                                    <div className="max-h-[480px] overflow-auto scrollbar-rounded">
                                        <div className="flex flex-col gap-4">

                                            {[...noti.data].sort((a: NotificationAPIResponse, b: NotificationAPIResponse) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
                                                .map((notification: NotificationAPIResponse, index: number) => {
                                                    return (
                                                        <div key={index}
                                                             onClick={() => {
                                                                 if (!notification.read) {
                                                                     dispatch(markIsReadNotification(notification.id));
                                                                     apiWithToken(getCookie("refreshToken")).patch("/notifications/update-read", {
                                                                         id: notification.id,
                                                                         read: true
                                                                     }, {
                                                                         headers: {
                                                                             Authorization: "Bearer " + accessToken
                                                                         }
                                                                     });
                                                                 }
                                                             }}
                                                             className="flex grow gap-2.5">
                                                            <div className="relative shrink-0 mt-0.5">
                                                                <img alt="" className="rounded-full size-8"
                                                                     src={server + notification.fromUser.avatar}/>
                                                                <div
                                                                    className="bg-[#17c653] rounded-full size-1.5 badge badge-circle color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2"/>
                                                            </div>
                                                            <div className="flex flex-col gap-3.5">
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="text-2sm font-medium">
                                                                        <a className="hover:text-primary-active text-gray-900 font-semibold"
                                                                           href="#">
                                                                            {notification.fromUser.address.fullName}
                                                                        </a> {" "}
                                                                        <span
                                                                            className="text-gray-700">{notification.message}</span>
                                                                    </div>
                                                                    <span
                                                                        className="flex items-center text-2xs font-medium text-gray-500">{formatDistanceToNow(notification.createdDate, {addSuffix: true})}<span
                                                                        className="rounded-full bg-gray-500 size-1 mx-1.5"></span>{format(notification.createdDate, "yyyy-MM-dd - hh:mm:ss")}</span>
                                                                    <div className="flex flex-wrap gap-2.5">
                                                                        <Button>
                                                                            Client-Request
                                                                        </Button>
                                                                        <Button>
                                                                            Figma
                                                                        </Button>
                                                                        <Button>
                                                                            Redesign
                                                                        </Button>
                                                                    </div>

                                                                </div>
                                                            </div>
                                                            <div
                                                                className="w-5 h-5 flex items-center justify-center">
                                                                <div hidden={notification.read}
                                                                     className="w-2 h-2 bg-primary rounded-full"></div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            {/*<div className="border-b border-b-gray-200"></div>*/}
                                        </div>
                                    </div>,
                                },
                                {
                                    key: '2',
                                    label: 'Chưa đọc',
                                    children:
                                        <div className="max-h-[480px] overflow-auto">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex grow gap-2.5">
                                                    <div className="relative shrink-0 mt-0.5">
                                                        <img alt="" className="rounded-full size-8"
                                                             src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"/>
                                                        <div
                                                            className="bg-[#17c653] rounded-full size-1.5 badge badge-circle color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2"/>
                                                    </div>
                                                    <div className="flex flex-col gap-3.5">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-2sm font-medium">
                                                                <a className="hover:text-primary-active text-gray-900 font-semibold"
                                                                   href="#">
                                                                    Joe Lincoln
                                                                </a> {" "}
                                                                <span className="text-gray-700">mentioned you in</span>
                                                                <a className="hover:text-primary-active text-primary"
                                                                   href="#">
                                                                    Latest Trends {" "}
                                                                </a>
                                                                <span className="text-gray-700">topic</span>
                                                            </div>
                                                            <span
                                                                className="flex items-center text-2xs font-medium text-gray-500">18 mins ago
                                                    <span className="rounded-full bg-gray-500 size-1 mx-1.5"></span>Web Design 2024</span>
                                                        </div>
                                                        <div
                                                            className="border shadow-none flex flex-col gap-2.5 p-3.5 rounded-lg bg-light-active">
                                                            <div className="flex grow gap-2.5">
                                                                <div className="relative shrink-0 mt-0.5">
                                                                    <img alt="" className="rounded-full size-8"
                                                                         src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"/>
                                                                    <div
                                                                        className="bg-[#17c653] rounded-full size-1.5 color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2"/>
                                                                </div>
                                                                <div className="flex flex-col gap-3.5">
                                                                    <div className="flex flex-col gap-1">
                                                                        <div
                                                                            className="text-2sm font-semibold text-gray-600 mb-px">
                                                                            <a className="hover:text-primary-active text-gray-900 font-semibold"
                                                                               href="#">
                                                                                @Cody
                                                                            </a>{" "}
                                                                            <span className="text-gray-700 font-medium">For an expert opinion, check out what Mike has to say on this topic!</span>
                                                                        </div>
                                                                        <span
                                                                            className="flex items-center text-2xs font-medium text-gray-500">18 mins ago
                                                                <span
                                                                    className="rounded-full bg-gray-500 size-1 mx-1.5"></span>
                                                                <Button type="link">Reply</Button>
                                                            </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-b border-b-gray-200"></div>
                                                <div className="flex grow gap-2.5">
                                                    <div className="relative shrink-0 mt-0.5">
                                                        <img alt="" className="rounded-full size-8"
                                                             src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"/>
                                                        <div
                                                            className="bg-[#17c653] rounded-full size-1.5 badge badge-circle color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2"/>
                                                    </div>
                                                    <div className="flex flex-col gap-3.5">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-2sm font-medium">
                                                                <a className="hover:text-primary-active text-gray-900 font-semibold"
                                                                   href="#">
                                                                    Joe Lincoln
                                                                </a> {" "}
                                                                <span className="text-gray-700">mentioned you in</span>
                                                                <a className="hover:text-primary-active text-primary"
                                                                   href="#">
                                                                    Latest Trends {" "}
                                                                </a>
                                                                <span className="text-gray-700">topic</span>
                                                            </div>
                                                            <span
                                                                className="flex items-center text-2xs font-medium text-gray-500">18 mins ago<span
                                                                className="rounded-full bg-gray-500 size-1 mx-1.5"></span>Web Design 2024</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2.5">
                                                            <Button>
                                                                Client-Request
                                                            </Button>
                                                            <Button>
                                                                Figma
                                                            </Button>
                                                            <Button>
                                                                Redesign
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="border-b border-b-gray-200"></div>
                                                <div className="flex grow gap-2.5">
                                                    <div className="relative shrink-0 mt-0.5">
                                                        <img alt="" className="rounded-full size-8"
                                                             src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"/>
                                                        <div
                                                            className="bg-[#17c653] rounded-full size-1.5 badge badge-circle color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2"/>
                                                    </div>
                                                    <div className="flex flex-col gap-3.5">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-2sm font-medium">
                                                                <a className="hover:text-primary-active text-gray-900 font-semibold"
                                                                   href="#">
                                                                    Joe Lincoln
                                                                </a> {" "}
                                                                <span className="text-gray-700">mentioned you in</span>
                                                                <a className="hover:text-primary-active text-primary"
                                                                   href="#">
                                                                    Latest Trends {" "}
                                                                </a>
                                                                <span className="text-gray-700">topic</span>
                                                            </div>
                                                            <span
                                                                className="flex items-center text-2xs font-medium text-gray-500">18 mins ago
                                                    <span className="rounded-full bg-gray-500 size-1 mx-1.5"></span>Web Design 2024</span>
                                                        </div>
                                                        <div
                                                            className="border shadow-none flex flex-col gap-2.5 p-3.5 rounded-lg bg-light-active">
                                                            <div className="flex grow gap-2.5">
                                                                <div className="relative shrink-0 mt-0.5">
                                                                    <img alt="" className="rounded-full size-8"
                                                                         src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"/>
                                                                    <div
                                                                        className="bg-[#17c653] rounded-full size-1.5 color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2"/>
                                                                </div>
                                                                <div className="flex flex-col gap-3.5">
                                                                    <div className="flex flex-col gap-1">
                                                                        <div
                                                                            className="text-2sm font-semibold text-gray-600 mb-px">
                                                                            <a className="hover:text-primary-active text-gray-900 font-semibold"
                                                                               href="#">
                                                                                @Cody
                                                                            </a>{" "}
                                                                            <span className="text-gray-700 font-medium">For an expert opinion, check out what Mike has to say on this topic!</span>
                                                                        </div>
                                                                        <span
                                                                            className="flex items-center text-2xs font-medium text-gray-500">18 mins ago
                                                                <span
                                                                    className="rounded-full bg-gray-500 size-1 mx-1.5"></span>
                                                                <Button type="link">Reply</Button>
                                                            </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            ]
                        } onChange={(key: string) => console.log(key)}/>
                    </div>
                    <div className="border-b border-b-gray-200"></div>
                    <div className="grid grid-cols-2 p-5 gap-2.5">
                        <button className="btn btn-sm btn-light justify-center">
                            Archive all
                        </button>
                        <button className="btn btn-sm btn-light justify-center">
                            Mark all as read
                        </button>
                    </div>
                </div>
            )
            } placement="bottomRight" trigger={['click']}>
                <Badge
                    count={noti.data.filter(item => !item.read).length > 0 ? noti.data.filter(item => !item.read).length : 0}>
                    <Avatar shape="square" icon={<BellOutlined/>} size="large"/>
                </Badge>
            </Dropdown>
        </>
    );
};

export default Notification;