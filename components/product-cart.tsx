import { Button, Card, Flex } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, deleteAllItem, ICart, ICartItem } from "../stores/cart.reducer";
import { NextRouter, useRouter } from "next/router";
import { RootState } from "../stores";
import { CurrentUser } from "../stores/user.reducer";
import { IRetailer } from "../pages/san-pham/[pid]";
import { server } from "../utils/server";
import Link from "next/link";
import Banner from "./slide-banner";
import CustomInput from "./custom-input ";

const ProductCart = ({ id, price, thumbnail, name, retailer, status }: {
    id: string,
    price: number,
    thumbnail: string,
    name: string,
    retailer: IRetailer,
    status: boolean
}) => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [quantity, setQuantity] = useState<number>(1);

    const carts: ICart[] = useSelector((state: RootState) => state.cart.carts);

    const isExisted: boolean = carts.some(item => item.cartItems.some(cartItem => cartItem.id === id));

    const [pending, setPending] = useState<boolean>(false);

    const addToCart = (): void => {
        if (currentUser.id) {
            const payload: ICartItem = { id, price, thumbnail, name, quantity, retailer } as ICartItem;
            dispatch(addItem(payload));
        } else {
            router.push("/login");
        }
    };

    const getCheckout = (): void => {
        setPending(true);
        if (currentUser.id) {
            addToCart();
            router.push("/checkout").then(() => {
                setPending(false);
            });
        } else {
            dispatch(deleteAllItem({}));
            router.push("/login");
            setPending(false);
        }
    };

    return (
        <div className="sticky top-5">
            <Card className='text-left text-black h-fit' size='small'>
                <div className="flex justify-between">
                    <div className="flex">
                        <Link href={`/cua-hang/${retailer.id}`}>
                            <a>
                                <img className="w-12 h-12 rounded-[100%] overflow-hidden object-cover"
                                    src={server + retailer.avatar}
                                    alt={""} />
                            </a>
                        </Link>
                        <div>
                            <span className="mx-2 font-semibold">{retailer.username}</span>
                            <div className="ml-2 font-semibold flex gap-2">
                                <div>
                                    <span className="flex items-center gap-1">4.9
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                            viewBox="0 0 125 125"><path
                                                fill="#FDD835"
                                                d="m68.05 7.23l13.46 30.7a7.05 7.05 0 0 0 5.82 4.19l32.79 2.94c3.71.54 5.19 5.09 2.5 7.71l-24.7 20.75c-2 1.68-2.91 4.32-2.36 6.87l7.18 33.61c.63 3.69-3.24 6.51-6.56 4.76L67.56 102a7.03 7.03 0 0 0-7.12 0l-28.62 16.75c-3.31 1.74-7.19-1.07-6.56-4.76l7.18-33.61c.54-2.55-.36-5.19-2.36-6.87L5.37 52.78c-2.68-2.61-1.2-7.17 2.5-7.71l32.79-2.94a7.05 7.05 0 0 0 5.82-4.19l13.46-30.7c1.67-3.36 6.45-3.36 8.11-.01"></path><path
                                                    fill="#FFFF8D"
                                                    d="m67.07 39.77l-2.28-22.62c-.09-1.26-.35-3.42 1.67-3.42c1.6 0 2.47 3.33 2.47 3.33l6.84 18.16c2.58 6.91 1.52 9.28-.97 10.68c-2.86 1.6-7.08.35-7.73-6.13"></path><path
                                                        fill="#F4B400"
                                                        d="M95.28 71.51L114.9 56.2c.97-.81 2.72-2.1 1.32-3.57c-1.11-1.16-4.11.51-4.11.51l-17.17 6.71c-5.12 1.77-8.52 4.39-8.82 7.69c-.39 4.4 3.56 7.79 9.16 3.97"></path></svg>
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
                        <div className='text-md font-medium mb-2'>Số lượng</div>
                        <CustomInput
                            min={1}
                            max={20}
                            defaultValue={1}
                            value={quantity}
                            onChange={(value: number | null) => setQuantity(value ?? 1)}
                            disabled={isExisted}
                        />
                    </div>
                    <div>
                        <div className='text-md font-medium mb-2'>Tạm tính</div>
                        <div>
                            <div className='text-2xl font-semibold'>
                                {price * quantity}
                                <sup>₫</sup>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    status ? (
                        <Flex vertical gap='small' className="w-full">
                            <Button type='primary' danger block disabled={pending} loading={pending}
                                onClick={getCheckout}>
                                Mua ngay
                            </Button>
                            <Button block onClick={addToCart}
                                disabled={isExisted}>{isExisted ? 'Sản phẩm đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}</Button>
                        </Flex>
                    ) : (
                        <Flex vertical gap='small' className="w-full">
                            <Button disabled={!status}>
                                Sản phẩm này đã hết
                            </Button>
                        </Flex>
                    )
                }
            </Card>
            <Banner></Banner>
        </div>
    );
};

export default ProductCart;