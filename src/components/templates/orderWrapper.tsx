import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { fetchOrdersRequest } from "@/redux/modules/order";
import { Card, List, Typography } from "antd";
import { Order } from "@/type/types";

import { ProductLoading } from "../atoms/productLoading";
import OrderCard from "../molecules/orderCard";

const { Title } = Typography;

export default function OrderWrapper() {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);

    const { page, isFetchLoading } = useSelector((state: RootState) => state.order);

    useEffect(() => {
        dispatch(fetchOrdersRequest({ page: 0, pageSize: 10 }));
    }, [dispatch]);

    if (isFetchLoading) {
        return <ProductLoading />;
    }

    return (
        <div className="">
            <Card title={<Title level={3}>Danh sách đơn hàng</Title>}>
                <List
                    grid={{ gutter: 16, column: 2, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                    dataSource={page.content}
                    renderItem={(order: Order) => (
                        <List.Item>
                            <OrderCard order={order} />
                        </List.Item>
                    )}
                    pagination={{
                        total: page.totalElements,
                        pageSize: 10,
                        current: currentPage,
                        onChange: (page: number, pageSize?: number) => {
                            setCurrentPage(page);
                            dispatch(fetchOrdersRequest({ page: page - 1, pageSize: pageSize || 10 }));
                        },
                        showSizeChanger: false,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`,
                    }}
                />
            </Card>
        </div>
    );
}