import { formatCurrency } from "@/utils/common";
import { Button, Result } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const amount = Number(searchParams.get("vnp_Amount")) / 100;
  const id = searchParams.get("vnp_TxnRef");
  const isSuccess = searchParams.get("vnp_TransactionStatus") === "00";

  return (
    <Result
      status={isSuccess ? "success" : "error"}
      title={isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
      subTitle={
        isSuccess
          ? `Cảm ơn bạn đã mua hàng. Đơn hàng trị giá ${formatCurrency(amount)} của bạn đã được xác nhận và sẽ được xử lý trong thời gian sớm nhất.`
          : "Rất tiếc, đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ."
      }
      extra={[
        <Button type="primary" key="home" onClick={() => navigate("/")}>
          Trở về trang chủ
        </Button>,
        isSuccess && (
          <Button
            key="orders"
            onClick={() => navigate(`/don-hang/${id}`)}
          >
            Xem đơn hàng
          </Button>
        ),
      ]}
    />
  );
};
