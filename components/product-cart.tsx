import Search from "antd/lib/input/Search";
import {Avatar, Button, Card, Col, Flex, InputNumber, Row} from "antd";
import React, {useState} from "react";

const ProductCart = ({price}: { price: number }) => {
    const [quantity, setQuantity] = useState<number>(1);

    const handleQuantityChange = (value: number | null) => {
        if (value !== null) {
            setQuantity(value);
        }
    };

    return (
        <Card size='small' style={{color: 'black', textAlign: 'left'}}>
            <div>Tên biến thể</div>
            <div>Số lượng</div>
            <InputNumber min={1} max={20} defaultValue={1} value={quantity} onChange={handleQuantityChange}/>
            <div>Tạm tính</div>
            <div>${price * quantity}</div>
            <Flex vertical gap='small' style={{width: '100%'}}>
                <Button type='primary' danger block>
                    Mua ngay
                </Button>
                <Button block>Thêm vào giỏ hàng</Button>
            </Flex>
        </Card>
    )
}

export default ProductCart