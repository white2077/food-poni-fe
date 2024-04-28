import {Button, Card, Flex, InputNumber} from "antd";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addItem, ICartItem} from "../stores/cart.reducer";
import {NextRouter, useRouter} from "next/router";
import {RootState} from "../stores";

const ProductCart = ({id, price, thumbnail, name}: {id: string, price: number, thumbnail: string, name: string}) => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState<number>(1);

    const cartItems: ICartItem[] = useSelector((state: RootState) => state.cart.cartItems) as ICartItem[];

    const isExisted: boolean = cartItems.some(item => item.id === id);

    const addToCart = (): void => {
        const payload: ICartItem = {id, price, thumbnail, name, quantity} as ICartItem;
        dispatch(addItem(payload));
    };

    const getCheckout = (): void => {
        addToCart();
        router.push("/checkout");
    };

    return (
        <Card size='small' style={{color: 'black', textAlign: 'left'}}>
            <div>{name}</div>
            <div>Số lượng</div>
            <InputNumber
                min={1}
                max={20}
                defaultValue={1}
                value={quantity}
                onChange={(value) => setQuantity(value ? value : 1)} disabled={isExisted}/>
            <div>Tạm tính</div>
            <div>${price * quantity}</div>
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