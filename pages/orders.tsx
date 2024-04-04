import {DefaultLayout} from "../components/layout";
import {List, notification} from "antd";
import React, {useEffect, useState} from "react";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {Page} from "../model/common";
import {useSelector} from "react-redux";
import {CurrentUser} from "../model/User";
import OrderCard from "../components/order-card";
import {Order} from "../model/Order";

const Orders = () => {

    const currentUser = useSelector(state => state.user.currentUser) as CurrentUser;

    const [orders, setOrders] = useState<Order[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = () => {
        axiosConfig.get("/orders", {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<Page<Order[]>>) {
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
    }

    return (
        <DefaultLayout>
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
        </DefaultLayout>
    )

}

export default Orders;