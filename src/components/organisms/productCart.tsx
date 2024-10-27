import { Button, Card, Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../slide-banner.tsx";
import { RootState } from "@/redux/store.ts";
import { createCartAction } from "@/redux/modules/cart.ts";
import CustomInput from "@/components/molecules/customInput.tsx";
import { updateProductSelectedQuantitySuccess } from "@/redux/modules/product.ts";
import { currencyFormat } from "@/utils/common.ts";

export default function ProductCart() {
  const dispatch = useDispatch();
  const { toppingsSelected, productDetail, quantity, type } = useSelector(
    (state: RootState) => state.product.itemsSelected,
  );
  const { page, isCreateLoading } = useSelector(
    (state: RootState) => state.cart,
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const isExisted: boolean = page.content.some(
    (it) =>
      it.productDetail.id === productDetail.id &&
      JSON.stringify(it.toppings) === JSON.stringify(toppingsSelected) &&
      it.type === type,
  );

  return (
    <div className="lg:sticky top-5">
      <Card className="text-left text-black h-fit" size="small">
        <div className="flex justify-between mb-6">
          <div>
            <div className="text-md font-medium mb-2">Số lượng</div>
            <CustomInput
              min={1}
              max={100}
              defaultValue={1}
              value={quantity}
              onChange={(value: number) =>
                dispatch(
                  updateProductSelectedQuantitySuccess({ quantity: value }),
                )
              }
              disabled={false}
            />
          </div>
          <div>
            <div className="text-md font-medium mb-2">Tạm tính</div>
            <div>
              <div className="text-2xl font-semibold">
                {currencyFormat(
                  (productDetail.price +
                    toppingsSelected.reduce((acc, it) => acc + it.price, 0)) *
                    quantity,
                )}
              </div>
            </div>
          </div>
        </div>
        {productDetail.status ? (
          <Flex vertical gap="small" className="w-full">
            <Button
              type="primary"
              danger
              block
              onClick={() => {
                if (!isExisted) {
                  dispatch(createCartAction());
                }
                window.location.href = "/checkout";
              }}
              disabled={currentUser?.role === "RETAILER"}
            >
              Mua ngay
            </Button>
            <Button
              block
              onClick={() => dispatch(createCartAction())}
              loading={isCreateLoading}
              disabled={isExisted || currentUser?.role === "RETAILER"}
            >
              {isExisted
                ? "Sản phẩm đã có trong giỏ hàng"
                : "Thêm vào giỏ hàng"}
            </Button>
          </Flex>
        ) : (
          <Flex vertical gap="small" className="w-full">
            <Button disabled={true}>Sản phẩm này đã hết</Button>
          </Flex>
        )}
      </Card>
      <Banner />
    </div>
  );
}
