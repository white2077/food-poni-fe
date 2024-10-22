import { Button, Card, Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../slide-banner.tsx";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import { createCartAction } from "@/redux/modules/cart.ts";
import CustomInput from "@/components/molecules/customInput.tsx";
import { updateProductSelectedQuantitySuccess } from "@/redux/modules/product.ts";
import { currencyFormat, getThumbnail } from "@/utils/common.ts";

export default function ProductCart() {
  const navigate = useNavigate();
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
        <div className="flex justify-between">
          <div className="flex">
            <Link to={`/cua-hang/${productDetail.id}`}>
              <img
                className="w-12 h-12 rounded-[100%] overflow-hidden object-cover"
                src={getThumbnail("")}
                alt={""}
              />
            </Link>
            <div>
              <span className="mx-2 font-semibold">{productDetail.id}</span>
              <div className="ml-2 font-semibold flex gap-2">
                <div>
                  <span className="flex items-center gap-1">
                    4.9
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 125 125"
                    >
                      <path
                        fill="#FDD835"
                        d="m68.05 7.23l13.46 30.7a7.05 7.05 0 0 0 5.82 4.19l32.79 2.94c3.71.54 5.19 5.09 2.5 7.71l-24.7 20.75c-2 1.68-2.91 4.32-2.36 6.87l7.18 33.61c.63 3.69-3.24 6.51-6.56 4.76L67.56 102a7.03 7.03 0 0 0-7.12 0l-28.62 16.75c-3.31 1.74-7.19-1.07-6.56-4.76l7.18-33.61c.54-2.55-.36-5.19-2.36-6.87L5.37 52.78c-2.68-2.61-1.2-7.17 2.5-7.71l32.79-2.94a7.05 7.05 0 0 0 5.82-4.19l13.46-30.7c1.67-3.36 6.45-3.36 8.11-.01"
                      ></path>
                      <path
                        fill="#FFFF8D"
                        d="m67.07 39.77l-2.28-22.62c-.09-1.26-.35-3.42 1.67-3.42c1.6 0 2.47 3.33 2.47 3.33l6.84 18.16c2.58 6.91 1.52 9.28-.97 10.68c-2.86 1.6-7.08.35-7.73-6.13"
                      ></path>
                      <path
                        fill="#F4B400"
                        d="M95.28 71.51L114.9 56.2c.97-.81 2.72-2.1 1.32-3.57c-1.11-1.16-4.11.51-4.11.51l-17.17 6.71c-5.12 1.77-8.52 4.39-8.82 7.69c-.39 4.4 3.56 7.79 9.16 3.97"
                      ></path>
                    </svg>
                  </span>
                </div>
                <div>
                  <p className=" text-gray-400 font-normal">(69 đánh giá)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center ">
            <span className="border-2 w-9 h-9 flex items-center justify-center  rounded-lg">
              <img className="w-5 h-5" src={"/tin-nhan.png"}></img>
            </span>
          </div>
        </div>
        <hr className="my-3.5"></hr>
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
                  dispatch(createCartAction({ navigate }));
                }
              }}
              disabled={currentUser?.role === "RETAILER"}
            >
              Mua ngay
            </Button>
            <Button
              block
              onClick={() => dispatch(createCartAction({ navigate: null }))}
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
