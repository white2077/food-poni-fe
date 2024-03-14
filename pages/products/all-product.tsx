import {Badge, Card, Col, Divider, Flex, List, Radio, Row} from 'antd';
import type {NextPage} from 'next'
import React, {useEffect, useState} from 'react'
import {StarFilled, StarOutlined} from "@ant-design/icons";
import {Product} from "../../model/Product";
import CardProduct from "../../components/card-product";

export interface IProduct {
    id: string;
    name: string;
    thumbnail: string | null;
    status: boolean;
    minPrice: number;
    maxPrice: number;
}

const Products: NextPage = () => {
    const [products, setProducts] = useState<IProduct[]>([]);

    useEffect(() => {
        getAll();
    }, []);

    const getAll = (): void => {
        fetch('http://localhost:8080/api/v1/products')
            .then(
                response => response.json())
            .then(response => {
                console.log("lay du lieu thanh cong");
                setProducts((response.content as Product[]).map((product): IProduct => {
                    return {
                        id: product.id,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        status: product.status,
                        minPrice: Math.min(...product.productDetails.map((productDetail) => productDetail.price)),
                        maxPrice: Math.max(...product.productDetails.map((productDetail) => productDetail.price))
                    }
                }));
            })
            .catch(response => console.log(response))
    }

    console.log(products);

    return (
        <List grid={{gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 5}}
              dataSource={products}
              renderItem={(product) => (
                  <List.Item>
                      <CardProduct product={product}></CardProduct>
                  </List.Item>
              )}
        />
    );
}

export default Products