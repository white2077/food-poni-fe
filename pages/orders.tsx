import {DefaultLayout} from "../components/layout";
import {Button, GetProp, List, notification, Result, Segmented, UploadProps} from "antd";
import React, {useEffect, useState} from "react";
import {AxiosResponse} from "axios";
import {useSelector} from "react-redux";
import OrderCard from "../components/order-card";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {NextRouter, useRouter} from "next/router";
import {CurrentUser} from "../stores/user.reducer";
import {OrderResponseDTO} from "../models/order/OrderResposeAPI";
import axiosInterceptor from "../utils/axiosInterceptor";
import {getAccessToken} from "../utils/auth";

enum OrderStatus {
    PENDING,
    APPROVED,
    COMPLETED,
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const Orders = () => {

    const router: NextRouter = useRouter();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [orders, setOrders] = useState<OrderResponseDTO[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect((): void => {
        getOrders();
    }, []);


    const getOrders = () => {
        axiosInterceptor.get("/customer/orders", {
            headers: {
                Authorization: 'Bearer ' + getAccessToken(),
            }
        })
            .then(function (res: AxiosResponse<Page<OrderResponseDTO[]>>) {
                // console.log(res.data.content);
                const sortedOrders = res.data.content.map((order: OrderResponseDTO) => {
                    const createdDate = new Date(order.createdDate ?? ""); // Chuyển đổi Timestamp thành đối tượng Date
                    return { ...order, createdDate };
                });

                // Sắp xếp sortedOrders theo createdDate giảm dần
                sortedOrders.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());

                setOrders(sortedOrders);
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

    const handleChange = (value: string) => {
        console.log(OrderStatus[value as keyof typeof OrderStatus]);
        // Xử lý logic tại đây nếu cần
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'Chờ xác nhận';
            case OrderStatus.APPROVED:
                return 'Chờ lấy hàng';
            case OrderStatus.COMPLETED:
                return 'Hoàn thành';
            default:
                return '';
        }
    };

    const orderStatusOptions = Object.values(OrderStatus)
        .filter((status) => typeof status === 'number')
        .map((status) => ({
            label: getStatusText(status as OrderStatus),
            value: String(status),
        }));

    return (
        <DefaultLayout>
            {
                currentUser.id ? (
                    <div style={{color: "black", textAlign: "left", width: "1440px"}}>
                        <div style={{textAlign: "left", width: "100%", marginBottom: "20px"}}>
                            <Segmented<string>
                                options={orderStatusOptions}
                                onChange={handleChange}
                                style={{width: "100%"}}
                            />
                        </div>
                        <List loading={isLoading}
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