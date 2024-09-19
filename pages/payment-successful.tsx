import React from 'react';
import { Result, Button } from 'antd';
import { DefaultLayout } from './_layout';
import { useRouter } from 'next/router';

const PaymentResult = () => {
    const router = useRouter();
    const { vnp_TransactionStatus, vnp_Amount } = router.query;

    const isSuccess = vnp_TransactionStatus === '00';

    const handleGoHome = () => {
        router.push('/');
    };

    const handleViewOrders = () => {
        router.push('/orders');
    };
    const formattedAmount = vnp_Amount
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(vnp_Amount) / 100)
        : '';

    return (
        <DefaultLayout>
            <Result
                status={isSuccess ? "success" : "error"}
                title={isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
                subTitle={isSuccess
                    ? `Cảm ơn bạn đã mua hàng. Đơn hàng trị giá ${formattedAmount} của bạn đã được xác nhận và sẽ được xử lý trong thời gian sớm nhất.`
                    : "Rất tiếc, đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ."}
                extra={[
                    <Button type="primary" key="home" onClick={handleGoHome}>
                        Trở về trang chủ
                    </Button>,
                    isSuccess && (
                        <Button key="orders" onClick={handleViewOrders}>
                            Xem đơn hàng
                        </Button>
                    ),
                ]}
            />
        </DefaultLayout>
    );
};

export default PaymentResult;
