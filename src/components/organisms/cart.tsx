import { useEffect, useState } from "react";
import { Avatar, Badge, Button, Divider, Drawer, List, Popconfirm } from "antd";
import { CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import EmptyNotice from "../empty-notice.tsx";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import { QuantityInput } from "@/components/molecules/quantityInput.tsx";
import { deleteCartRequest, fetchCartRequest } from "@/redux/modules/cart.ts";
import { server } from "@/utils/server.ts";

export default function Cart() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [open, setOpen] = useState<boolean>(false);

  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.cart,
  );

  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchCartRequest("createdDate,desc"));
  }, [dispatch]);

  const totalAmount = (): number => {
    let total = 0;
    page.content.forEach((item) => {
      total += item.productDetail.price * item.quantity;
    });
    return total;
  };

  return (
    <div>
      <a onClick={() => setOpen(true)} className="cursor-pointer">
        <Badge count={page.totalElements}>
          <Avatar
            className="p-2"
            shape="square"
            icon={<ShoppingCartOutlined />}
            size="large"
          />
        </Badge>
      </a>
      <Drawer title="Giỏ hàng" onClose={() => setOpen(false)} open={open}>
        {page.content.length === 0 ? (
          <EmptyNotice
            w="60"
            h="60"
            src="/no-product.png"
            message="Giỏ hàng trống"
          />
        ) : (
          <div>
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={page.content}
              loading={isFetchLoading}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div className="relative inline-block flex items-center">
                        <Avatar
                          className="rounded-lg w-20 h-20"
                          src={
                            item.productDetail.images[0].includes("http")
                              ? item.productDetail.images[0]
                              : server + item.productDetail.images[0]
                          }
                        />
                        <div className="absolute top-[-5px] w-6 h-6 right-[-5px] bg-gray-300 rounded-[100px] flex p-0 justify-center">
                          <Popconfirm
                            title="Bạn có chắc chắn muốn xóa không?"
                            onConfirm={() =>
                              dispatch(deleteCartRequest(item.productDetail.id))
                            }
                            okText="Đồng ý"
                            cancelText="Hủy"
                            okButtonProps={{ loading: item.isDeleteLoading }}
                          >
                            <CloseOutlined
                              className="p-0"
                              id={`delete-icon-${item.productDetail.id}`}
                              key="list-loadmore-edit"
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    }
                    title={<span>{item.productName}</span>}
                    description={
                      <span>
                        <span style={{ marginRight: "10px" }}>
                          {item.productDetail.price}
                          <sup>₫</sup>
                        </span>
                      </span>
                    }
                  />
                  <div className="mb-auto">
                    <div className="text-right mb-auto">
                      {item.productDetail.price * item.quantity}
                      <sup>₫</sup>
                    </div>
                    <QuantityInput item={item} />
                  </div>
                </List.Item>
              )}
            />
            <Divider />
          </div>
        )}
        {page.content.length > 0 && (
          <div>
            <div className="mt-3 flex justify-between">
              <div>Tổng tiền</div>
              <div>
                {totalAmount()}
                <sup>₫</sup>
              </div>
            </div>
            <Divider />
            <Button
              className="my-5s mt-2"
              type="primary"
              danger
              block
              disabled={pending}
              loading={pending}
              onClick={() => {
                setPending(true);
                // if (currentUser.id) {
                navigate("/checkout");
                // } else {
                //     navigate("/auth/login");
                //     setPending(false);
                // }
              }}
            >
              Thanh toán ngay
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
