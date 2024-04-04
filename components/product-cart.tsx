import {Button, Card, Flex, InputNumber} from "antd";
import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addItem, ICartItem} from "../store/cart.reducer";
import {useRouter} from "next/router";
import {RootState} from "../store";

const ProductCart = ({id, price, thumbnail, name}: {id: string, price: number, thumbnail: string, name: string}) => {
    const [quantity, setQuantity] = useState<number>(1);
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.cartItems) as ICartItem[];
    const isExisted = cartItems.some(item => item.id === id);
    const router = useRouter();
    const addToCart = () => {
        const payload = {id, price, thumbnail, name, quantity} as ICartItem;
        dispatch(addItem(payload));
    }

    const getCheckout = () => {
        addToCart();
        router.push("/checkout");
    }

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
    )
}

export default ProductCart