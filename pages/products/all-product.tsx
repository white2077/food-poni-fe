import {Card, Flex, List, Radio} from 'antd';
import type {NextPage} from 'next'
import React, {useEffect, useState} from 'react'
import {StarFilled, StarOutlined} from "@ant-design/icons";

export interface IProduct {
    id: string;
    name: string;
    thumbnail: string | null;
    status: boolean;
    minPrice: () => number;
    maxPrice: () => number;
}

const Products: NextPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [value, setValue] = React.useState<string>('horizontal');

    useEffect(() => {
        getAll();
    }, []);

    const getAll = () => {
        fetch('http://localhost:8080/api/v1/products')
            .then(
                response => response.json())
            .then(response => {
                console.log("lay du lieu thanh cong");
                setProducts(response.content);
            })
            .catch(response => console.log(response))
    }

    console.log(products);

    return (
        <List
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 4,
            }}
            dataSource={products}
            renderItem={(product) => (
                <List.Item>
                    <Card
                        hoverable
                        style={{width: 240}}
                        cover={<img alt="example"
                                    src="https://png.pngtree.com/png-clipart/20221001/ourmid/pngtree-fast-food-big-ham-burger-png-image_6244235.png"/>}
                    >
                        <Meta title={
                            <h4 style={{
                                textAlign: 'left',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {product.name}
                            </h4>}
                        />
                        <Flex gap="middle" vertical>
                            <Flex vertical={value === 'vertical'}>
                                {Array.from({length: 5}).map((_, i) => (
                                    <div key={i}
                                         style={{backgroundColor: "white"}}>
                                        <StarFilled style={{color: '#FEC32D'}}/>
                                    </div>
                                ))}
                            </Flex>
                        </Flex>
                    </Card>
                </List.Item>
            )}
        />
    );
}

const {Meta} = Card;

export default Products