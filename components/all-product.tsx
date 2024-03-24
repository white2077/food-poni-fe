import {List} from 'antd';
import type {NextPage} from 'next'
import React, {useEffect, useState} from 'react'
import {Product} from "../model/Product";
import CardProduct from "./card-product";
import {server} from "../utils/server";

export interface IProductCard {
    id: string;
    name: string;
    thumbnail: string | null;
    minPrice: number;
    maxPrice: number;
}

const Products: NextPage = () => {
    const [products, setProducts] = useState<IProductCard[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getAll();
    }, []);

    const getAll = (): void => {
        fetch(`${server}/products`)
            .then(
                response => response.json())
            .then(response => {
                setProducts((response.content as Product[]).map((product): IProductCard => {
                    return {
                        id: product.id,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        minPrice: Math.min(...product.productDetails.map((productDetail) => productDetail.price)),
                        maxPrice: Math.max(...product.productDetails.map((productDetail) => productDetail.price)),
                    }
                }));
                setIsLoading(false);
            })
            .catch(response => console.log(response))
    }

    return (
        <List loading={isLoading} grid={{gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 5}}
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