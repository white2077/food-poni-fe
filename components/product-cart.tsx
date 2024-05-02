import {Avatar, Button, Card, Divider, Flex, InputNumber, List} from "antd";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addItem, deleteAllItem, ICartItem} from "../stores/cart.reducer";
import {NextRouter, useRouter} from "next/router";
import {RootState} from "../stores";
import {CurrentUser} from "../stores/user.reducer";

const ProductCart = ({id, price, thumbnail, name}: { id: string, price: number, thumbnail: string, name: string }) => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [quantity, setQuantity] = useState<number>(1);

    const cartItems: ICartItem[] = useSelector((state: RootState) => state.cart.cartItems);

    const isExisted: boolean = cartItems.some(item => item.id === id);

    const addToCart = (): void => {
        const payload: ICartItem = {id, price, thumbnail, name, quantity} as ICartItem;
        dispatch(addItem(payload));
    };

    const getCheckout = (): void => {
        if (currentUser && currentUser.accessToken) {
            addToCart();
            router.push("/checkout");
        } else {
            dispatch(deleteAllItem({}));
            router.push("/login");
        }
    };

    return (
        <Card className='text-left text-black h-fit' size='small'>
            <div>retailer here</div>
            <Divider/>
            <div className='text-md font-medium'>Số lượng</div>
            <InputNumber
                min={1}
                max={20}
                defaultValue={1}
                value={quantity}
                onChange={(value: number | null) => setQuantity(value ?? 1)} disabled={isExisted}/>
            <div className='text-md font-medium'>Tạm tính</div>
            <div className='text-2xl font-semibold'>${price * quantity}</div>
            <Flex vertical gap='small' style={{width: '100%'}}>
                <Button type='primary' danger block onClick={getCheckout}>
                    Mua ngay
                </Button>
                <Button block onClick={addToCart}
                        disabled={isExisted}>{isExisted ? 'Sản phẩm đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}</Button>
            </Flex>
        </Card>
    );

};

export default ProductCart;