import {DefaultLayout} from "./_layout";
import {GetProp, Segmented, UploadProps} from "antd";
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
    REJECTED,
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
                pageSize: 100,
                sort: 'createdDate,desc'
            })
        }
    };
}

const Orders = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<OrderAPIResponse[]> }) => {

    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const handleChange = (value: string) => {
        console.log(OrderStatus[value as keyof typeof OrderStatus]);
        setSelectedStatus(value);
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'Chờ xác nhận';
            case OrderStatus.APPROVED:
                return 'Chờ lấy hàng';
            case OrderStatus.REJECTED:
                return 'Bị từ chối';
            case OrderStatus.COMPLETED:
                return 'Hoàn thành';
            default:
                return '';
        }
    };

    const filteredOrders = selectedStatus !== ""
        ? ePage.content.filter(order => order.status === OrderStatus[parseInt(selectedStatus)])
        : ePage.content.filter(order => order.status === 'PENDING');

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
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredOrders.map((order: OrderAPIResponse) => (
                        <div key={order.id}>
                            <OrderCard order={order}/>
                        </div>
                    ))}
                </div>
            </div>
        </DefaultLayout>
    );

};

export default Orders;