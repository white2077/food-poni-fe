import { BellOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  notification,
  Radio,
  Result,
} from "antd";
import { useEffect, useState } from "react";

import { server } from "@/utils/server.ts";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";

import { ScrollPane } from "@/components/atoms/scrollPane.tsx";
import {
  addToCartItemsSuccess,
  deleteCartGroupSuccess,
  deleteCartItemSuccess,
  leaveCartGroupSuccess,
  updateCartItemQuantitySuccess
} from "@/redux/modules/cartGroup";
import {
  fetchNotificationsAction,
  markIsReadNotificationsAction,
  pushNotificationSuccess,
} from "@/redux/modules/notification.ts";
import { RootState } from "@/redux/store.ts";
import {
  CartGroupEvent,
  Notification,
  NotificationAttributes,
} from "@/type/types.ts";
import { accessToken } from "@/utils/axiosConfig";
import { getAvatar } from "@/utils/common.ts";
import { getNotificationOrderMessage } from "@/utils/constraint.ts";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

export default function NotificationDropdown() {
  const dispatch = useDispatch();
  const { page } = useSelector((state: RootState) => state.notification);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState<string>("all");

  useEffect(() => {
    dispatch(
      fetchNotificationsAction({
        queryParams: { page: 0, pageSize: 10, sort: "createdDate,desc" },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser) return;

    const sock = new SockJS(`${server}/ws?token=Bearer ${accessToken}`);
    if (sock) {
      const client = new Client({
        webSocketFactory: () => sock,
        onConnect: () => {
          console.log("Connect to socket successfully..." + currentUser.id);
          client.subscribe("/topic/admin-notifications", (message) => {
            const notificationEvent: Notification = JSON.parse(message.body);

            const attributes = JSON.parse(
              notificationEvent.attributes
            ) as NotificationAttributes;

            if (notificationEvent.toUser.id === currentUser.id) {
              dispatch(
                pushNotificationSuccess({ notification: notificationEvent })
              );
              notification.open({
                type: ["COMPLETED", "APPROVED", "PENDING"].includes(
                  attributes.orderStatus
                )
                  ? "success"
                  : "error",
                placement: "bottomRight",
                message: notificationEvent.createdDate.toString(),
                description: getNotificationOrderMessage(
                  attributes.id,
                  attributes.orderStatus
                ),
                duration: 10,
                btn: (
                  <Button
                    className="bg-primary text-white"
                    onClick={() => console.log("Click vao thong bao")}
                  >
                    Xem ngay
                  </Button>
                ),
              });
            }
          });

          client.subscribe("/user/topic/room", (message) => {
            const cartGroupEvent: CartGroupEvent = JSON.parse(message.body);
            if (
              cartGroupEvent.type === "ADD_CART_ITEM" &&
              cartGroupEvent.attributes &&
              "productDetail" in cartGroupEvent.attributes
            ) {
              const {
                cartItemId,
                quantity,
                productDetail,
                productName,
                toppings,
                type,
              } = cartGroupEvent.attributes;
              dispatch(
                addToCartItemsSuccess({
                  cartItem: {
                    id: cartItemId,
                    quantity,
                    productDetail,
                    productName,
                    user: cartGroupEvent.user,
                    toppings,
                    type,
                    updatingQuantityLoading: false,
                    deletingCartItemLoading: false,
                  },
                  roomId: cartGroupEvent.roomId,
                })
              );
            }

            if (cartGroupEvent.user.id !== currentUser.id) {
              if (
                cartGroupEvent.type === "UPDATE_CART_ITEM_QUANTITY" &&
                cartGroupEvent.attributes &&
                "cartItemId" in cartGroupEvent.attributes &&
                "quantity" in cartGroupEvent.attributes
              ) {
                const { cartItemId, quantity } = cartGroupEvent.attributes;
                dispatch(
                  updateCartItemQuantitySuccess({ id: cartItemId, quantity })
                );
              }

              if (
                cartGroupEvent.type === "DELETE_CART_ITEM" &&
                cartGroupEvent.attributes &&
                "cartItemId" in cartGroupEvent.attributes
              ) {
                const { cartItemId } = cartGroupEvent.attributes;
                dispatch(deleteCartItemSuccess({ id: cartItemId }));
              }

              if (cartGroupEvent.type === "LEAVE_GROUP") {
                dispatch(
                  leaveCartGroupSuccess({
                    roomId: cartGroupEvent.roomId,
                    userId: cartGroupEvent.user.id,
                  })
                );
              }

              if (cartGroupEvent.type === "DELETE_GROUP") {
                dispatch(
                  deleteCartGroupSuccess({
                    roomId: cartGroupEvent.roomId,
                  })
                );         
              }

              // console.log(message.body);
            }
          });
        },
        onStompError: (frame) => {
          console.log("Error connecting to Websocket server", frame);
        },
      });
      client.activate();
    }

    return () => {
      if (sock) {
        sock.close();
      }
    };
  }, []);

  return (
    <>
      <Dropdown
        className="cursor-pointer"
        dropdownRender={() => (
          <div className="w-[500px] shadow border rounded-lg bg-white">
            <div className="flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5">
              Thông báo
            </div>
            <div className="border-b border-b-gray-200"></div>
            <div className="px-5 mb-2">
              <div className="text-center">
                <Radio.Group
                  className="my-4"
                  value={tab}
                  onChange={(e) => {
                    setTab(e.target.value);
                    if (e.target.value === "all") {
                      dispatch(
                        fetchNotificationsAction({
                          queryParams: {
                            page: 0,
                            pageSize: 10,
                            sort: "createdDate,desc",
                          },
                        })
                      );
                    }
                    if (e.target.value === "unread") {
                      dispatch(
                        fetchNotificationsAction({
                          queryParams: {
                            page: 0,
                            pageSize: 10,
                            sort: "createdDate,desc",
                            read: "false",
                          },
                        })
                      );
                    }
                    if (e.target.value === "read") {
                      dispatch(
                        fetchNotificationsAction({
                          queryParams: {
                            page: 0,
                            pageSize: 10,
                            sort: "createdDate,desc",
                            read: "true",
                          },
                        })
                      );
                    }
                  }}
                >
                  <Radio.Button value="all">Tất cả</Radio.Button>
                  <Radio.Button value="unread">Chưa đọc</Radio.Button>
                  <Radio.Button value="read">Đã đọc</Radio.Button>
                </Radio.Group>
              </div>
              <ScrollPane maxHeight="max-h-[480px]">
                {page.size > 0 ? (
                  <div className="flex flex-col gap-1">
                    {page.content.map((it, index) => {
                      const attributes = JSON.parse(
                        it.attributes
                      ) as NotificationAttributes;
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            if (!it.read) {
                              dispatch(
                                markIsReadNotificationsAction({
                                  id: it.id,
                                })
                              );
                            }
                          }}
                          className={`flex grow gap-2.5 ${!it.read && "bg-gray-100"} hover:bg-gray-50 rounded-lg p-2 cursor-pointer items-center`}
                        >
                          <div className="relative shrink-0">
                            <img
                              alt=""
                              className="object-cover aspect-square rounded-full size-16"
                              src={getAvatar(it.fromUser)}
                            />

                            <div className="bg-[#17c653] rounded-full size-2 badge badge-circle color-white absolute top-14 end-0.5 ring-1 ring-white transform -translate-y-1/2" />
                          </div>
                          <div className="flex flex-col gap-3.5">
                            <div className="flex flex-col gap-1">
                              <div className="text-2sm font-medium">
                                {getNotificationOrderMessage(
                                  attributes.id,
                                  attributes.orderStatus
                                )}
                              </div>
                              <span className="flex items-center text-2xs font-medium text-gray-500">
                                {(() => {
                                  const hoursDiff =
                                    Math.abs(
                                      new Date().getTime() -
                                        new Date(it.createdDate).getTime()
                                    ) / 36e5;

                                  if (hoursDiff > 48) {
                                    return (
                                      <span>
                                        {format(
                                          it.createdDate,
                                          "hh:mm dd-MM-yyyy"
                                        )}
                                      </span>
                                    );
                                  } else if (hoursDiff > 24) {
                                    return (
                                      <span>
                                        Hôm qua{" "}
                                        {format(it.createdDate, "hh:mm")}
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <span>
                                        {formatDistanceToNow(it.createdDate, {
                                          addSuffix: true,
                                          locale: vi,
                                        })}
                                      </span>
                                    );
                                  }
                                })()}
                              </span>
                            </div>
                          </div>
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div
                              hidden={it.read}
                              className="w-2 h-2 bg-primary rounded-full"
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Result
                    icon={<BellOutlined />}
                    title="Bạn chưa có thông báo"
                  />
                )}
              </ScrollPane>
              {/*<Tabs*/}
              {/*  defaultActiveKey="1"*/}
              {/*  items={[*/}
              {/*    {*/}
              {/*      key: "1",*/}
              {/*      label: "Tất cả",*/}
              {/*      children: (*/}
              {/*        */}
              {/*      ),*/}
              {/*    },*/}
              {/*    // {*/}
              {/*    //   key: "2",*/}
              {/*    //   label: "Chưa đọc",*/}
              {/*    //   children: (*/}
              {/*    //     <div className="max-h-[480px] overflow-auto scrollbar-rounded">*/}
              {/*    //       {page.content.filter((item) => !item.read).length >*/}
              {/*    //       0 ? (*/}
              {/*    //         <div className="flex flex-col gap-4">*/}
              {/*    //           {page.content.map((it, index) => {*/}
              {/*    //             return (*/}
              {/*    //               <div*/}
              {/*    //                 key={index.d.ts}*/}
              {/*    //                 onClick={() => {*/}
              {/*    //                   if (!it.read) {*/}
              {/*    //                     dispatch(*/}
              {/*    //                       markIsReadNotification({id : it.id}),*/}
              {/*    //                     );*/}
              {/*    //                     apiWithToken().patch(*/}
              {/*    //                       "/notifications/update-read",*/}
              {/*    //                       {*/}
              {/*    //                         id: notification.id,*/}
              {/*    //                         read: true,*/}
              {/*    //                       },*/}
              {/*    //                       {*/}
              {/*    //                         headers: {*/}
              {/*    //                           Authorization:*/}
              {/*    //                             "Bearer " + accessToken,*/}
              {/*    //                         },*/}
              {/*    //                       },*/}
              {/*    //                     );*/}
              {/*    //                   }*/}
              {/*    //                 }}*/}
              {/*    //                 className="flex grow gap-2.5"*/}
              {/*    //               >*/}
              {/*    //                 <div className="relative shrink-0 mt-0.5">*/}
              {/*    //                   <img*/}
              {/*    //                     alt=""*/}
              {/*    //                     className="rounded-full size-8"*/}
              {/*    //                     src={*/}
              {/*    //                       server + notification.fromUser.avatar*/}
              {/*    //                     }*/}
              {/*    //                   />*/}
              {/*    //                   <div className="bg-[#17c653] rounded-full size-1.5 badge badge-circle color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2" />*/}
              {/*    //                 </div>*/}
              {/*    //                 <div className="flex flex-col gap-3.5">*/}
              {/*    //                   <div className="flex flex-col gap-1">*/}
              {/*    //                     <div className="text-2sm font-medium">*/}
              {/*    //                       <a*/}
              {/*    //                         className="hover:text-primary-active text-gray-900 font-semibold"*/}
              {/*    //                         href="#"*/}
              {/*    //                       >*/}
              {/*    //                         {*/}
              {/*    //                           notification.fromUser.address*/}
              {/*    //                             .fullName*/}
              {/*    //                         }*/}
              {/*    //                       </a>{" "}*/}
              {/*    //                       <span className="text-gray-700">*/}
              {/*    //                         {notification.message}*/}
              {/*    //                       </span>*/}
              {/*    //                     </div>*/}
              {/*    //                     <span className="flex items-center text-2xs font-medium text-gray-500">*/}
              {/*    //                       {(() => {*/}
              {/*    //                         const hoursDiff =*/}
              {/*    //                           Math.abs(*/}
              {/*    //                             new Date().getTime() -*/}
              {/*    //                               new Date(*/}
              {/*    //                                 notification.createdDate,*/}
              {/*    //                               ).getTime(),*/}
              {/*    //                           ) / 36e5;*/}
              {/*    //*/}
              {/*    //                         if (hoursDiff > 48) {*/}
              {/*    //                           return (*/}
              {/*    //                             <span>*/}
              {/*    //                               {format(*/}
              {/*    //                                 notification.createdDate,*/}
              {/*    //                                 "hh:mm dd-MM-yyyy",*/}
              {/*    //                               )}*/}
              {/*    //                             </span>*/}
              {/*    //                           );*/}
              {/*    //                         } else if (hoursDiff > 24) {*/}
              {/*    //                           return (*/}
              {/*    //                             <span>*/}
              {/*    //                               Hôm qua{" "}*/}
              {/*    //                               {format(*/}
              {/*    //                                 notification.createdDate,*/}
              {/*    //                                 "hh:mm",*/}
              {/*    //                               )}*/}
              {/*    //                             </span>*/}
              {/*    //                           );*/}
              {/*    //                         } else {*/}
              {/*    //                           return (*/}
              {/*    //                             <span>*/}
              {/*    //                               {formatDistanceToNow(*/}
              {/*    //                                 notification.createdDate,*/}
              {/*    //                                 {*/}
              {/*    //                                   addSuffix: true,*/}
              {/*    //                                   locale: vi,*/}
              {/*    //                                 },*/}
              {/*    //                               )}*/}
              {/*    //                             </span>*/}
              {/*    //                           );*/}
              {/*    //                         }*/}
              {/*    //                       })()}*/}
              {/*    //                     </span>*/}
              {/*    //                   </div>*/}
              {/*    //                 </div>*/}
              {/*    //                 <div className="w-5 h-5 flex items-center justify-center">*/}
              {/*    //                   <div*/}
              {/*    //                     hidden={notification.read}*/}
              {/*    //                     className="w-2 h-2 bg-primary rounded-full"*/}
              {/*    //                   ></div>*/}
              {/*    //                 </div>*/}
              {/*    //               </div>*/}
              {/*    //             );*/}
              {/*    //           })}*/}
              {/*    //           /!*<div className="border-b border-b-gray-200"></div>*!/*/}
              {/*    //         </div>*/}
              {/*    //       ) : (*/}
              {/*    //         <Result*/}
              {/*    //           icon={<BellOutlined />}*/}
              {/*    //           title="Bạn chưa có thông báo"*/}
              {/*    //         />*/}
              {/*    //       )}*/}
              {/*    //     </div>*/}
              {/*    //   ),*/}
              {/*    // },*/}
              {/*    // {*/}
              {/*    //   key: "3",*/}
              {/*    //   label: "Để tạm đây :))",*/}
              {/*    //   children: (*/}
              {/*    //     <div className="max-h-[480px] overflow-auto">*/}
              {/*    //       <AudioPlayer />*/}
              {/*    //       <div className="flex flex-col gap-4">*/}
              {/*    //         <div className="flex grow gap-2.5">*/}
              {/*    //           <div className="relative shrink-0 mt-0.5">*/}
              {/*    //             <img*/}
              {/*    //               alt=""*/}
              {/*    //               className="rounded-full size-8"*/}
              {/*    //               src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"*/}
              {/*    //             />*/}
              {/*    //             <div className="bg-[#17c653] rounded-full size-1.5 badge badge-circle color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2" />*/}
              {/*    //           </div>*/}
              {/*    //           <div className="flex flex-col gap-3.5">*/}
              {/*    //             <div className="flex flex-col gap-1">*/}
              {/*    //               <div className="text-2sm font-medium">*/}
              {/*    //                 <a*/}
              {/*    //                   className="hover:text-primary-active text-gray-900 font-semibold"*/}
              {/*    //                   href="#"*/}
              {/*    //                 >*/}
              {/*    //                   Joe Lincoln*/}
              {/*    //                 </a>{" "}*/}
              {/*    //                 <span className="text-gray-700">*/}
              {/*    //                   mentioned you in*/}
              {/*    //                 </span>*/}
              {/*    //                 <a*/}
              {/*    //                   className="hover:text-primary-active text-primary"*/}
              {/*    //                   href="#"*/}
              {/*    //                 >*/}
              {/*    //                   Latest Trends{" "}*/}
              {/*    //                 </a>*/}
              {/*    //                 <span className="text-gray-700">topic</span>*/}
              {/*    //               </div>*/}
              {/*    //               <span className="flex items-center text-2xs font-medium text-gray-500">*/}
              {/*    //                 18 mins ago*/}
              {/*    //                 <span className="rounded-full bg-gray-500 size-1 mx-1.5"></span>*/}
              {/*    //                 Web Design 2024*/}
              {/*    //               </span>*/}
              {/*    //             </div>*/}
              {/*    //             <div className="border shadow-none flex flex-col gap-2.5 p-3.5 rounded-lg bg-light-active">*/}
              {/*    //               <div className="flex grow gap-2.5">*/}
              {/*    //                 <div className="relative shrink-0 mt-0.5">*/}
              {/*    //                   <img*/}
              {/*    //                     alt=""*/}
              {/*    //                     className="rounded-full size-8"*/}
              {/*    //                     src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"*/}
              {/*    //                   />*/}
              {/*    //                   <div className="bg-[#17c653] rounded-full size-1.5 color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2" />*/}
              {/*    //                 </div>*/}
              {/*    //                 <div className="flex flex-col gap-3.5">*/}
              {/*    //                   <div className="flex flex-col gap-1">*/}
              {/*    //                     <div className="text-2sm font-semibold text-gray-600 mb-px">*/}
              {/*    //                       <a*/}
              {/*    //                         className="hover:text-primary-active text-gray-900 font-semibold"*/}
              {/*    //                         href="#"*/}
              {/*    //                       >*/}
              {/*    //                         @Cody*/}
              {/*    //                       </a>{" "}*/}
              {/*    //                       <span className="text-gray-700 font-medium">*/}
              {/*    //                         For an expert opinion, check out what*/}
              {/*    //                         Mike has to say on this topic!*/}
              {/*    //                       </span>*/}
              {/*    //                     </div>*/}
              {/*    //                     <span className="flex items-center text-2xs font-medium text-gray-500">*/}
              {/*    //                       18 mins ago*/}
              {/*    //                       <span className="rounded-full bg-gray-500 size-1 mx-1.5"></span>*/}
              {/*    //                       <Button type="link">Reply</Button>*/}
              {/*    //                     </span>*/}
              {/*    //                   </div>*/}
              {/*    //                 </div>*/}
              {/*    //               </div>*/}
              {/*    //             </div>*/}
              {/*    //           </div>*/}
              {/*    //         </div>*/}
              {/*    //         <div className="border-b border-b-gray-200"></div>*/}
              {/*    //         <div className="flex grow gap-2.5">*/}
              {/*    //           <div className="relative shrink-0 mt-0.5">*/}
              {/*    //             <img*/}
              {/*    //               alt=""*/}
              {/*    //               className="rounded-full size-8"*/}
              {/*    //               src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"*/}
              {/*    //             />*/}
              {/*    //             <div className="bg-[#17c653] rounded-full size-1.5 badge badge-circle color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2" />*/}
              {/*    //           </div>*/}
              {/*    //           <div className="flex flex-col gap-3.5">*/}
              {/*    //             <div className="flex flex-col gap-1">*/}
              {/*    //               <div className="text-2sm font-medium">*/}
              {/*    //                 <a*/}
              {/*    //                   className="hover:text-primary-active text-gray-900 font-semibold"*/}
              {/*    //                   href="#"*/}
              {/*    //                 >*/}
              {/*    //                   Joe Lincoln*/}
              {/*    //                 </a>{" "}*/}
              {/*    //                 <span className="text-gray-700">*/}
              {/*    //                   mentioned you in*/}
              {/*    //                 </span>*/}
              {/*    //                 <a*/}
              {/*    //                   className="hover:text-primary-active text-primary"*/}
              {/*    //                   href="#"*/}
              {/*    //                 >*/}
              {/*    //                   Latest Trends{" "}*/}
              {/*    //                 </a>*/}
              {/*    //                 <span className="text-gray-700">topic</span>*/}
              {/*    //               </div>*/}
              {/*    //               <span className="flex items-center text-2xs font-medium text-gray-500">*/}
              {/*    //                 18 mins ago*/}
              {/*    //                 <span className="rounded-full bg-gray-500 size-1 mx-1.5"></span>*/}
              {/*    //                 Web Design 2024*/}
              {/*    //               </span>*/}
              {/*    //             </div>*/}
              {/*    //             <div className="flex flex-wrap gap-2.5">*/}
              {/*    //               <Button>Client-Request</Button>*/}
              {/*    //               <Button>Figma</Button>*/}
              {/*    //               <Button>Redesign</Button>*/}
              {/*    //             </div>*/}
              {/*    //           </div>*/}
              {/*    //         </div>*/}
              {/*    //         <div className="border-b border-b-gray-200"></div>*/}
              {/*    //         <div className="flex grow gap-2.5">*/}
              {/*    //           <div className="relative shrink-0 mt-0.5">*/}
              {/*    //             <img*/}
              {/*    //               alt=""*/}
              {/*    //               className="rounded-full size-8"*/}
              {/*    //               src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"*/}
              {/*    //             />*/}
              {/*    //             <div className="bg-[#17c653] rounded-full size-1.5 badge badge-circle color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2" />*/}
              {/*    //           </div>*/}
              {/*    //           <div className="flex flex-col gap-3.5">*/}
              {/*    //             <div className="flex flex-col gap-1">*/}
              {/*    //               <div className="text-2sm font-medium">*/}
              {/*    //                 <a*/}
              {/*    //                   className="hover:text-primary-active text-gray-900 font-semibold"*/}
              {/*    //                   href="#"*/}
              {/*    //                 >*/}
              {/*    //                   Joe Lincoln*/}
              {/*    //                 </a>{" "}*/}
              {/*    //                 <span className="text-gray-700">*/}
              {/*    //                   mentioned you in*/}
              {/*    //                 </span>*/}
              {/*    //                 <a*/}
              {/*    //                   className="hover:text-primary-active text-primary"*/}
              {/*    //                   href="#"*/}
              {/*    //                 >*/}
              {/*    //                   Latest Trends{" "}*/}
              {/*    //                 </a>*/}
              {/*    //                 <span className="text-gray-700">topic</span>*/}
              {/*    //               </div>*/}
              {/*    //               <span className="flex items-center text-2xs font-medium text-gray-500">*/}
              {/*    //                 18 mins ago*/}
              {/*    //                 <span className="rounded-full bg-gray-500 size-1 mx-1.5"></span>*/}
              {/*    //                 Web Design 2024*/}
              {/*    //               </span>*/}
              {/*    //             </div>*/}
              {/*    //             <div className="border shadow-none flex flex-col gap-2.5 p-3.5 rounded-lg bg-light-active">*/}
              {/*    //               <div className="flex grow gap-2.5">*/}
              {/*    //                 <div className="relative shrink-0 mt-0.5">*/}
              {/*    //                   <img*/}
              {/*    //                     alt=""*/}
              {/*    //                     className="rounded-full size-8"*/}
              {/*    //                     src="https://keenthemes.com/static/metronic/tailwind/dist/assets/media/avatars/300-4.png"*/}
              {/*    //                   />*/}
              {/*    //                   <div className="bg-[#17c653] rounded-full size-1.5 color-white absolute top-7 end-0.5 ring-1 ring-white transform -translate-y-1/2" />*/}
              {/*    //                 </div>*/}
              {/*    //                 <div className="flex flex-col gap-3.5">*/}
              {/*    //                   <div className="flex flex-col gap-1">*/}
              {/*    //                     <div className="text-2sm font-semibold text-gray-600 mb-px">*/}
              {/*    //                       <a*/}
              {/*    //                         className="hover:text-primary-active text-gray-900 font-semibold"*/}
              {/*    //                         href="#"*/}
              {/*    //                       >*/}
              {/*    //                         @Cody*/}
              {/*    //                       </a>{" "}*/}
              {/*    //                       <span className="text-gray-700 font-medium">*/}
              {/*    //                         For an expert opinion, check out what*/}
              {/*    //                         Mike has to say on this topic!*/}
              {/*    //                       </span>*/}
              {/*    //                     </div>*/}
              {/*    //                     <span className="flex items-center text-2xs font-medium text-gray-500">*/}
              {/*    //                       18 mins ago*/}
              {/*    //                       <span className="rounded-full bg-gray-500 size-1 mx-1.5"></span>*/}
              {/*    //                       <Button type="link">Reply</Button>*/}
              {/*    //                     </span>*/}
              {/*    //                   </div>*/}
              {/*    //                 </div>*/}
              {/*    //               </div>*/}
              {/*    //             </div>*/}
              {/*    //           </div>*/}
              {/*    //         </div>*/}
              {/*    //       </div>*/}
              {/*    //     </div>*/}
              {/*    //   ),*/}
              {/*    // },*/}
              {/*  ]}*/}
              {/*  onChange={(key: string) => console.log(key)}*/}
              {/*/>*/}
            </div>
            <div className="border-b border-b-gray-200"></div>
            <div className="grid grid-cols-2 p-5 gap-2.5">
              <button className="btn btn-sm btn-light justify-center hover:text-[#F36F24]">
                Xem thông báo trước đó
              </button>
              <button className="btn btn-sm btn-light justify-center hover:text-[#F36F24]">
                Đánh dấu tất cả là đã đọc
              </button>
            </div>
          </div>
        )}
        placement="bottomRight"
        trigger={["click"]}
      >
        <Badge
          count={
            page.content.filter((it) => !it.read).length > 0
              ? page.content.filter((it) => !it.read).length
              : 0
          }
        >
          <Avatar shape="square" icon={<BellOutlined />} size="large" />
        </Badge>
      </Dropdown>
    </>
  );
}
