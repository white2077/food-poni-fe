import {Button, Card, Divider, Flex, InputNumber} from "antd";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addItem, deleteAllItem, ICart, ICartItem} from "../stores/cart.reducer";
import {NextRouter, useRouter} from "next/router";
import {RootState} from "../stores";
import {CurrentUser} from "../stores/user.reducer";
import {IRetailer} from "../pages/[pid]";

const ProductCart = ({id, price, thumbnail, name, retailer}: { id: string, price: number, thumbnail: string, name: string, retailer: IRetailer }) => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [quantity, setQuantity] = useState<number>(1);

    const carts: ICart[] = useSelector((state: RootState) => state.cart.carts);

    const isExisted: boolean = carts.some(item => item.cartItems.some(cartItem => cartItem.id === id));

    const addToCart = (): void => {
        if (currentUser.id) {
            const payload: ICartItem = {id, price, thumbnail, name, quantity, retailer} as ICartItem;
            dispatch(addItem(payload));
        } else {
            router.push("/login");
        }
    };

    const getCheckout = (): void => {
        if (currentUser.id) {
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
            <div className='text-md font-medium'>Quantity</div>
            <InputNumber
                min={1}
                max={20}
                defaultValue={1}
                value={quantity}
                onChange={(value: number | null) => setQuantity(value ?? 1)} disabled={isExisted}/>
            <div className='text-md font-medium'>Subtotal</div>
            <div className='text-2xl font-semibold'>${price * quantity}</div>
            <Flex vertical gap='small' style={{width: '100%'}}>
                <Button type='primary' danger block onClick={getCheckout}>
                    Buy now
                </Button>
                <Button block onClick={addToCart}
                        disabled={isExisted}>{isExisted ? 'Product existed in cart' : 'Add to cart'}</Button>
            </Flex>
        </Card>
    );

};

export default ProductCart;