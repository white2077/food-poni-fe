import {DefaultLayout} from "./_layout";
import {GetProp, List, Segmented, UploadProps} from "antd";
import React, {useEffect, useState} from "react";
import {AxiosResponse} from "axios";
import OrderCard from "../components/order-card";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {NextApiRequest, NextApiResponse} from "next";
import {CookieValueTypes, getCookie} from "cookies-next";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {REFRESH_TOKEN} from "../utils/server";
import {OrderAPIResponse} from "../models/order/OrderAPIResponse";

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

export async function getServerSideProps({req, res}: { req: NextApiRequest, res: NextApiResponse }) {
    const refreshToken: CookieValueTypes = getCookie(REFRESH_TOKEN, {req});
    if (refreshToken) {
        try {
            const res: AxiosResponse<Page<OrderAPIResponse[]>> = await apiWithToken(refreshToken).get('/customer/orders', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            console.log(res);

            return {
                props: {
                    ePage: res.data,
                },
            };
        } catch (error) {
            console.error('Error fetching page:', error);
        }
    }

    return {
        redirect: {
            destination: '/login',
            permanent: false,
        },
    }
}

const Orders = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<OrderAPIResponse[]> }) => {

    const [orders, setOrders] = useState<OrderAPIResponse[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const sortedOrders = ePage.content.map((order: OrderAPIResponse) => {
            const createdDate = new Date(order.createdDate ?? ""); // Chuyển đổi Timestamp thành đối tượng Date
            return { ...order, createdDate };
        });

        // Sắp xếp sortedOrders theo createdDate giảm dần
        sortedOrders.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());

        setOrders(sortedOrders);
        setIsLoading(false);
    }, [ePage]);

    const handleChange = (value: string) => {
        // console.log(OrderStatus[value as keyof typeof OrderStatus]);
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
            <div style={{color: "black", textAlign: "left", width: "1440px"}}>
                <div style={{textAlign: "left", width: "100%", marginBottom: "20px"}}>
                    <Segmented<string>
                        options={orderStatusOptions}
                        onChange={handleChange}
                        style={{width: "100%"}}
                    />
                </div>
                <List dataSource={orders} loading={isLoading}
                      renderItem={(order: OrderAPIResponse) => (
                          <List.Item>
                              <OrderCard order={order}></OrderCard>
                          </List.Item>
                      )}
                />
            </div>
        </DefaultLayout>
    );

};

export default Orders;