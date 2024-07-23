import {Avatar, Button, Card, Divider, Flex, InputNumber} from "antd";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addItem, deleteAllItem, ICart, ICartItem} from "../stores/cart.reducer";
import {NextRouter, useRouter} from "next/router";
import {RootState} from "../stores";
import {CurrentUser} from "../stores/user.reducer";
import {IRetailer} from "../pages/[pid]";
import {server} from "../utils/server";
import CustomInput from "./customInput ";
import Link from "next/link";

const ProductCart = ({id, price, thumbnail, name, retailer}: {
    id: string,
    price: number,
    thumbnail: string,
    name: string,
    retailer: IRetailer
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
            const payload: ICartItem = {id, price, thumbnail, name, quantity, retailer} as ICartItem;
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
        <Card className='text-left text-black h-fit' size='small'>
            <div className="flex">

                <Link href={"/shop/[sid].tsx"}>
                    <a>
                        <img className="w-12 h-12 rounded-[100%] overflow-hidden object-cover"
                             src={server + retailer.avatar}
                             alt={""}/>
                    </a>
                </Link>

                <div>
                    <span className="mx-2 font-semibold">{retailer.username}</span>
                    <div className="ml-2 font-semibold ">
                        <span>
                            <span className="">4.9 *</span>
                        </span>
                        <span>
                            <span className="mx-2 text-gray-400 font-normal">(69 đánh giá)</span>
                        </span>
                    </div>
                </div>
                <div className="w-[44%] flex justify-end items-center">
                    <span className="border-2 w-9 h-9 flex items-center justify-center  rounded-lg">
                        <img className="w-5 h-5" src={"TinNhan.png"}></img>
                    </span>
                </div>
            </div>
            <hr className="my-3.5"></hr>
            <div className="flex gap-24 mb-6">
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
                        <div className='text-2xl font-semibold'>${price * quantity}</div>
                    </div>
                </div>
            </div>
            <Flex vertical gap='small' style={{width: '100%'}}>
                <Button type='primary' danger block disabled={pending} loading={pending} onClick={getCheckout}>
                    Mua ngay
                </Button>
                <Button block onClick={addToCart}
                        disabled={isExisted}>{isExisted ? 'Sản phẩm đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}</Button>
            </Flex>
        </Card>
    );

};

export default ProductCart;