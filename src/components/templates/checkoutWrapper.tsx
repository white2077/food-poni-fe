import { Button, Card, Col, Divider, Form, Input, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import { useEffect } from "react";
import OrderItems from "@/components/organisms/orderItems.tsx";
import { CartState, fetchCartsAction } from "@/redux/modules/cart.ts";
import { createOrderAction } from "@/redux/modules/order.ts";
import PaymentInfo from "@/components/organisms/paymentInfo.tsx";
import ShippingAddress from "../organisms/shippingAddress";
import { currencyFormat } from "@/utils/common.ts";

const { TextArea } = Input;

const totalAmount = (content: CartState["page"]["content"]): number => {
  return content
    .filter((it) => it.checked)
    .reduce(
      (total, it) =>
        total +
        (it.productDetail.price +
          it.toppings.reduce((sum, tp) => sum + tp.price, 0)) *
          it.quantity,
      0,
    );
};

export default function CheckoutWrapper() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const carts = useSelector((state: RootState) => state.cart.page);
  const { form, isCreateLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(
      fetchCartsAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          status: true,
          sort: "createdDate,desc",
        },
      }),
    );
  }, [dispatch]);

  return (
    <div style={{ color: "black", textAlign: "left" }}>
      <h1 className="text-2xl mb-2">GIỎ HÀNG</h1>
      <Row gutter={16}>
        <Col flex="auto">
          <OrderItems />
        </Col>
        <Col flex="400px">
          <ShippingAddress />
          <PaymentInfo />
          <Card style={{ marginBottom: "16px" }}>
            <div className="flex justify-between">
              <div className="text-gray-500">Tạm tính</div>
              <span style={{ float: "right" }}>
                {currencyFormat(totalAmount(carts.content))}
                <sup>₫</sup>
              </span>
            </div>
            <div className="flex justify-between">
              <div className="text-gray-500">Giảm giá</div>
              <span className="float-right">
                0<sup>₫</sup>
              </span>
            </div>
            <Divider />
            <div className="flex justify-between">
              <div className="text-gray-500">Tổng tiền</div>
              <div className="grid">
                <div className="text-2xl text-red-500 text-right float-right">
                  {currencyFormat(totalAmount(carts.content))}
                  <sup>₫</sup>
                </div>
                <div className="right-0 text-gray-400">
                  (Đã bao gồm VAT nếu có)
                </div>
              </div>
            </div>
          </Card>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={() => dispatch(createOrderAction({ navigate }))}
          >
            <Form.Item name="note">
              <TextArea placeholder="Ghi chú" allowClear />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                danger
                block
                loading={isCreateLoading}
                disabled={
                  carts.content.length < 1 || form.shippingAddress === null
                }
              >
                Thanh toán
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
