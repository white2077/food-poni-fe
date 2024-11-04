import { QuantityInput } from "@/components/molecules/QuantityInput.tsx";
import { deleteCartRequest, fetchCartsAction } from "@/redux/modules/cart.ts";
import { RootState } from "@/redux/store.ts";
import { currencyFormat, getThumbnail } from "@/utils/common.ts";
import { CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Divider, Drawer, List, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EmptyNotice from "../atoms/EmptyNotice.tsx";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.cart,
  );
  const [pending, setPending] = useState<boolean>(false);

  useEffect(() => {
    dispatch(
      fetchCartsAction({
        queryParams: {
          status: true,
          sort: ["createdDate,desc"],
        },
      }),
    );
  }, [dispatch]);

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
              renderItem={(it) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div className="relative flex items-center">
                        <div className="w-20">
                          <Avatar
                            className="rounded-lg w-20 h-20"
                            src={getThumbnail(it.productDetail.images[0])}
                          />
                        </div>
                        <div className="absolute top-[-5px] w-5 h-5 right-[-5px] bg-gray-300 rounded-[100px] flex p-0 justify-center">
                          <Popconfirm
                            title="Bạn có chắc chắn muốn xóa không?"
                            onConfirm={() =>
                              dispatch(deleteCartRequest({ id: it.id }))
                            }
                            okText="Đồng ý"
                            cancelText="Hủy"
                            okButtonProps={{ loading: it.isDeleteLoading }}
                          >
                            <CloseOutlined className="p-0" />
                          </Popconfirm>
                        </div>
                      </div>
                    }
                    title={<div>{it.productName}</div>}
                    description={
                      <div>
                        <span style={{ marginRight: "10px" }}>
                          {currencyFormat(it.productDetail.price)}
                        </span>
                        {it.type && (
                          <div className="text-[10px]">
                            Loại:{" "}
                            <span className="bg-primary text-white rounded-lg mr-1 px-1">
                              {it.type}
                            </span>
                          </div>
                        )}
                        {it.toppings.length > 0 && (
                          <div className="text-[10px]">
                            <div>Topping:</div>
                            {it.toppings.map((tp, index) => {
                              return (
                                <div
                                  key={index}
                                  className="inline-block bg-primary text-white rounded-lg mr-1 px-1 mb-1"
                                >{`${tp.name}: ${tp.price}₫`}</div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    }
                  />
                  <div className="mb-auto">
                    <div className="text-right mb-auto">
                      {currencyFormat(
                        (it.productDetail.price +
                          it.toppings.reduce((sum, tp) => sum + tp.price, 0)) *
                          it.quantity,
                      )}
                    </div>
                    <QuantityInput item={it} />
                  </div>
                </List.Item>
              )}
            />
            <Divider />
            <div>
              <div className="mt-3 flex justify-between">
                <div>Tổng tiền</div>
                <div>
                  {currencyFormat(
                    page.content.reduce(
                      (total, it) =>
                        total +
                        (it.productDetail.price +
                          it.toppings.reduce((sum, tp) => sum + tp.price, 0)) *
                          it.quantity,
                      0,
                    ),
                  )}
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
                  navigate("/checkout");
                }}
              >
                Thanh toán ngay
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
