import OrderItems from "@/components/organisms/OrderItems";
import PaymentInfo from "@/components/organisms/PaymentInfo";
import { fetchCartsAction } from "@/redux/modules/cart.ts";
import { createOrderAction } from "@/redux/modules/order.ts";
import { RootState } from "@/redux/store.ts";
import { currencyFormat, totalAmount } from "@/utils/common.ts";
import { Button, Card, Col, Divider, Form, Input, Popconfirm, Row } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ShippingAddress from "../organisms/ShippingAddress";
import { DefaultLayout } from "../templates/DefaultLayout";

const { TextArea } = Input;

export const CheckoutPage = () => {
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
      })
    );
  }, [dispatch]);

  return (
    <DefaultLayout>
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
                </span>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Giảm giá</div>
                <span className="float-right">0 ₫</span>
              </div>
              <Divider />
              <div className="flex justify-between">
                <div className="text-gray-500">Tổng tiền</div>
                <div className="grid">
                  <div className="text-2xl text-red-500 text-right float-right">
                    {currencyFormat(totalAmount(carts.content))}
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
            >
              <Form.Item name="note">
                <TextArea placeholder="Ghi chú" allowClear />
              </Form.Item>
              <Form.Item>
                <Popconfirm
                  title="Bạn có chắc chắn muốn đặt hàng không?"
                  onConfirm={() => dispatch(createOrderAction({ navigate }))}
                  okText="Đồng ý"
                  cancelText="Hủy"
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    danger
                    block
                    loading={isCreateLoading}
                    disabled={
                      carts.content.filter((it) => it.checked).length < 1 ||
                      form.shippingAddress === null
                    }
                  >
                    Thanh toán
                  </Button>
                </Popconfirm>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </DefaultLayout>
  );
};
