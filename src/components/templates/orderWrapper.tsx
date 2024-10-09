import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { fetchOrdersRequest } from "@/redux/modules/order";
import { Card, List, Typography } from "antd";
import { Order } from "@/type/types";

import { ProductLoading } from "../atoms/productLoading";
import OrderCard from "../molecules/orderCard";

const { Title } = Typography;

const PAGE_SIZE = 10;

export default function OrderWrapper() {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);

    const { page, isFetchLoading } = useSelector((state: RootState) => state.order);

    useEffect(() => {
        dispatch(fetchOrdersRequest({ page: 0, sort: 'createdDate,desc' }));
    }, [dispatch]);

    if (isFetchLoading) {
        return <ProductLoading />;
    }

    return (
        <Card title={<Title level={3}>Danh sách đơn hàng</Title>}>
            <List
                grid={{ gutter: 16, column: 2, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                dataSource={page.content}
                renderItem={(order: Order, index: number) => (
                    <List.Item>
                        <OrderCard
                            order={order}
                            index={(currentPage - 1) * PAGE_SIZE + index + 1}
                        />
                    </List.Item>
                )}
                pagination={{
                    total: page.totalElements,
                    pageSize: PAGE_SIZE,
                    current: currentPage,
                    onChange: (page: number, pageSize?: number) => {
                        setCurrentPage(page);
                        dispatch(fetchOrdersRequest({ page: page - 1, sort: 'createdDate,desc', pageSize: pageSize || PAGE_SIZE }));
                    },
                    showSizeChanger: false,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                    style: { display: 'flex', justifyContent: 'center' }
                }}
            />
        </Card>
    );
}