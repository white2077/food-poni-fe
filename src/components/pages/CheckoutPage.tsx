import { CartItems } from "@/components/organisms/CartItems.tsx";
import { PaymentSelector } from "@/components/organisms/PaymentSelector.tsx";
import { ShippingAddressSelector } from "@/components/organisms/ShippingAddressSelector.tsx";
import { fetchAddressesAction } from "@/redux/modules/address.ts";
import { fetchCartsAction } from "@/redux/modules/cart.ts";
import {
  calculateShippingFeeAction,
  createOrderAction,
} from "@/redux/modules/order.ts";
import { RootState } from "@/redux/store.ts";
import { calculateTotalAmount, currencyFormat } from "@/utils/common.ts";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Popconfirm,
  Row,
  Spin,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DefaultLayout } from "../templates/DefaultLayout";

const { TextArea } = Input;

const useDispatchProp = () => {
  const dispatch = useDispatch();
  const fetchCarts = () =>
    dispatch(
      fetchCartsAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          status: true,
          sort: ["createdAt,desc"],
        },
      })
    );

  const fetchAddresses = () =>
    dispatch(
      fetchAddressesAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          status: true,
        },
      })
    );

  const calculateShippingFee = (addressId: string) =>
    dispatch(calculateShippingFeeAction({ addressId }));

  return { fetchCarts, fetchAddresses, calculateShippingFee };
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { page } = useSelector((state: RootState) => state.cart);
  const { isCreateLoading, shippingFee, isCalculateShippingFeeLoading } =
    useSelector((state: RootState) => state.order);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const { fetchCarts, fetchAddresses, calculateShippingFee } =
    useDispatchProp();

  useEffect(() => {
    fetchCarts();
    fetchAddresses();
    if (currentUser) {
      calculateShippingFee(currentUser.addressId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DefaultLayout>
      <div style={{ color: "black", textAlign: "left" }}>
        <p className="text-2xl mb-2">GIỎ HÀNG</p>
        <Row gutter={16}>
          <CartItems />
          <Col flex="400px">
            <Card style={{ marginBottom: "16px" }}>
              <div className="flex justify-between">
                <div className="text-gray-500">Tạm tính</div>
                <span style={{ float: "right" }}>
                  {currencyFormat(calculateTotalAmount(page.content))}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Phí vận chuyển</div>
                <span className="float-right">
                  {isCalculateShippingFeeLoading ? (
                    <Spin />
                  ) : (
                    currencyFormat(shippingFee)
                  )}
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
                    {currencyFormat(
                      calculateTotalAmount(page.content) + shippingFee
                    )}
                  </div>
                  <div className="right-0 text-gray-400">
                    (Đã bao gồm VAT nếu có)
                  </div>
                </div>
              </div>
            </Card>
            {currentUser && page.content.length > 0 && (
              <OrderForm
                currentUserRole={currentUser.role}
                currentUserAddressId={currentUser.addressId}
                isCreateLoading={isCreateLoading}
                calculateShippingFee={(addressId: string) =>
                  calculateShippingFee(addressId)
                }
                onSubmit={(values: OrderRequest) =>
                  dispatch(
                    createOrderAction({
                      values,
                      navigate,
                    })
                  )
                }
              />
            )}
          </Col>
        </Row>
      </div>
    </DefaultLayout>
  );
};

export type OrderRequest = {
  addressId: string;
  note: string;
  paymentMethod: "CASH" | "VNPAY" | "MOMO" | "POSTPAID";
};

const OrderForm = ({
  currentUserRole,
  currentUserAddressId,
  isCreateLoading,
  calculateShippingFee,
  onSubmit,
}: {
  currentUserRole: "VIP" | "CUSTOMER" | "RETAILER";
  currentUserAddressId: string;
  isCreateLoading: boolean;
  calculateShippingFee: (addressId: string) => void;
  onSubmit: (values: OrderRequest) => void;
}) => {
  const [form] = useForm<OrderRequest>();
  return (
    <Form
      form={form}
      onFinish={(values) => onSubmit(values)}
      initialValues={{
        addressId: currentUserAddressId,
        paymentMethod: "CASH",
        shippingMethod: "FREE",
      }}
    >
      <Form.Item name="addressId">
        <ShippingAddressSelector
          value={form.getFieldValue("addressId")}
          onOk={(value) => {
            form.setFieldValue("addressId", value);
            calculateShippingFee(value);
          }}
        />
      </Form.Item>
      <Form.Item name="paymentMethod">
        <PaymentSelector
          value={form.getFieldValue("paymentMethod")}
          currentUserRole={currentUserRole}
          onSelected={(value) => form.setFieldValue("paymentMethod", value)}
        />
      </Form.Item>
      <Form.Item name="note">
        <TextArea placeholder="Ghi chú" />
      </Form.Item>
      <Form.Item>
        <Popconfirm
          title="Bạn có chắc chắn muốn đặt hàng không?"
          onConfirm={() => form.submit()}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            htmlType="button"
            danger
            block
            loading={isCreateLoading}
          >
            Thanh toán
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
