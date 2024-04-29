import {DefaultLayout} from "../components/layout";
import {Button, List, notification, Result} from "antd";
import React, {useEffect, useState} from "react";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {useSelector} from "react-redux";
import OrderCard from "../components/order-card";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {NextRouter, useRouter} from "next/router";
import {OrderResponseDTO} from "../models/order/OrderResposeAPI";
import {CurrentUser} from "../stores/user.reducer";

const Orders = () => {

    const router: NextRouter = useRouter();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [orders, setOrders] = useState<OrderResponseDTO[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect((): void => {
        getOrders();
    }, []);

    const getOrders = () => {
        axiosConfig.get("/customer/orders", {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<Page<OrderResponseDTO[]>>) {
                // console.log(res.data);
                setOrders(res.data.content);
                setIsLoading(false);
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Order message',
                    description: res.message
                });
            })
    };

    return (
        <DefaultLayout>
            {
                (currentUser.id ?? "") ? (
                    <div style={{color: "black", textAlign: "left"}}>
                        <List loading={isLoading} grid={{gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 5}}
                              dataSource={orders}
                              renderItem={(order) => (
                                  <List.Item>
                                      <OrderCard order={order}></OrderCard>
                                  </List.Item>
                              )}
                        />
                    </div>
                ) : (
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>}
                    />
                )
            }
        </DefaultLayout>
    );

};

export default Orders;