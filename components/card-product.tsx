import {Badge, Card, Divider, Flex} from "antd";
import React from "react";
import {StarFilled} from "@ant-design/icons";
import {IProduct} from "../pages/products/all-product";

const CardProduct = ({product}: { product: IProduct }) => {
    const [value, setValue] = React.useState<string>('horizontal');

    return (
        <Card
            hoverable
            cover={<img alt="example"
                        src="https://png.pngtree.com/png-clipart/20221001/ourmid/pngtree-fast-food-big-ham-burger-png-image_6244235.png"/>}
        >
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px'}}>
                <Badge count="Khoảng 2km"
                       color='#F5F5FA'
                       style={{color: 'black', marginRight: '8px'}}/>
            </div>
            <div style={{
                textAlign: 'left',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '16px',
                marginBottom: '5px'
            }}>
                {product.name}
            </div>
            <Flex gap="middle" vertical style={{marginBottom: '5px'}}>
                <Flex vertical={value === 'vertical'}>
                    {Array.from({length: 5}).map((_, i) => (
                        <div key={i}
                             style={{backgroundColor: "white"}}>
                            <StarFilled style={{color: '#FEC32D'}}/>
                        </div>
                    ))}
                </Flex>
            </Flex>
            <div style={{textAlign: 'left', fontSize: '20px', fontWeight: 'bold'}}>${product.minPrice} -
                ${product.maxPrice}</div>
            <Divider/>
            <div style={{fontSize: '14px'}}>Dự kiến giao lúc 22:30</div>
        </Card>
    )
}

export default CardProduct