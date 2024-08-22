import {DefaultLayout} from "./_layout";
import {GetProp, Pagination, PaginationProps, Result, Segmented, UploadProps} from "antd";
import React, {useState} from "react";
import OrderCard from "../components/order-card";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {OrderAPIResponse} from "../models/order/OrderAPIResponse";
import {getOrdersPage} from "../queries/order.query";
import {NextRequest} from "next/server";
import {QueryPageType} from "../queries/type";
import {AxiosError} from "axios";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";
import Loading from "../components/loading-product";
import {ShoppingOutlined} from "@ant-design/icons";
import EmptyNotice from "../components/empty-notice";

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
                pageSize: 10,
                sort: 'createdDate,desc'
            })
        }
    };
}

const Orders = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<OrderAPIResponse[]> }) => {

    const [orderPage, setOrderPage] = React.useState<Page<OrderAPIResponse[]>>(ePage);

    const [isLoading, setLoading] = React.useState<boolean>(false);

    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const [current, setCurrent] = useState<number>(1);

    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
        console.log(current, pageSize);
        setCurrent(current);
        queryPage({page: current - 1, pageSize});
    };

    const queryPage = ({page, pageSize}: QueryPageType): void => {
        setLoading(true);
        getOrdersPage({
                refreshToken: getCookie(REFRESH_TOKEN),
                page: page ?? orderPage.number,
                pageSize: pageSize ?? orderPage.size,
                sort: 'createdDate,desc'
            }
        ).then((res: Page<OrderAPIResponse[]>) => setOrderPage(res))
            .catch((res: AxiosError<ErrorAPIResponse>) => {
                console.log(res.message);
            })
            .finally((() => setLoading(false)));
    }

    const handleChange = (value: string) => {
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
        ? orderPage.content.filter(order => order.status === OrderStatus[parseInt(selectedStatus)])
        : orderPage.content.filter(order => order.status === 'PENDING');

    const orderStatusOptions = Object.values(OrderStatus)
        .filter((status) => typeof status === 'number')
        .map((status) => ({
            label: getStatusText(status as OrderStatus),
            value: String(status),
        }));

    return (
        <DefaultLayout>
            <div className="text-black text-left font-sans">
                <div className="mb-4">
                    <div className="text-center w-full mb-4 !sticky top-5 z-50">
                        <Segmented
                            className="!bg-orange-500 !text-white !sticky"
                            size="large"
                            options={orderStatusOptions}
                            onChange={handleChange}
                        />
                    </div>
                    {
                        isLoading ? <Loading/> : (
                            <div>
                                {
                                    filteredOrders.length === 0 ? (

                                        <EmptyNotice w="42" h="32" src="/no-oder.png" message="Chưa có đơn hàng nào"/>
                                    ) : (
                                        <div
                                            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                                            {filteredOrders.map((order: OrderAPIResponse) => (
                                                <div key={order.id}>
                                                    <OrderCard order={order}/>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            <Pagination
                align="center"
                showSizeChanger
                defaultCurrent={1}
                onChange={onShowSizeChange}
                current={current}
                total={ePage.totalElements}
            />
        </DefaultLayout>
    );

};

export default Orders;