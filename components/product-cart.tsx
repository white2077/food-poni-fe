import {Button, Card, Flex, InputNumber} from "antd";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {addItem} from "../store/cart/reducer";

const ProductCart = ({id, price, thumbnail, name}) => {
    const [quantity, setQuantity] = useState<number>(1);
    const dispatch = useDispatch();

    const addToCart = () => dispatch(addItem({id, price, thumbnail, name, quantity}));

    return (
        <Card size='small' style={{color: 'black', textAlign: 'left'}}>
            <div>Tên biến thể</div>
            <div>Số lượng</div>
            <InputNumber min={1} max={20} defaultValue={1} value={quantity} onChange={(value) => setQuantity(value)}/>
            <div>Tạm tính</div>
            <div>${price * quantity}</div>
            <Flex vertical gap='small' style={{width: '100%'}}>
                <Button type='primary' danger block>
                    Mua ngay
                </Button>
                <Button block onClick={addToCart}>Thêm vào giỏ hàng</Button>
            </Flex>
        </Card>
    )
}

export default ProductCart