import {DefaultLayout} from "./_layout";
import {GetProp, List, Segmented, UploadProps} from "antd";
import React, {useEffect, useState} from "react";
import OrderCard from "../components/order-card";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {OrderAPIResponse} from "../models/order/OrderAPIResponse";
import {getOrdersPage} from "../queries/order.query";
import {NextRequest} from "next/server";

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

export async function getServerSideProps({req}: { req: NextRequest }) {
    return {
        props: {
            ePage: await getOrdersPage({
                refreshToken: getCookie(REFRESH_TOKEN, {req}),
                page: 0,
                pageSize: 10
            })
        }
    };
}

const Orders = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<OrderAPIResponse[]> }) => {

    const [orders, setOrders] = useState<OrderAPIResponse[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const sortedOrders = ePage.content.map((order: OrderAPIResponse) => {
            const createdDate = new Date(order.createdDate ?? ""); // Chuyển đổi Timestamp thành đối tượng Date
            return {...order, createdDate};
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
            <div style={{color: "black", textAlign: "left",}} className="">
                <div style={{textAlign: "left", width: "100%", marginBottom: "20px"}}>
                    <Segmented<string>
                        options={orderStatusOptions}
                        onChange={handleChange}
                        style={{width: "100%"}}
                    />
                </div>
                <div className="grid grid-cols-2 grid-auto-rows gap-4">
                    {orders.map((order: OrderAPIResponse) => (
                        <div>
                            <OrderCard order={order}/>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );

};

export default Orders;