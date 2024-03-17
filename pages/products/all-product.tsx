import {List} from 'antd';
import type {NextPage} from 'next'
import React, {useEffect, useState} from 'react'
import {Product} from "../../model/Product";
import CardProduct from "../../components/card-product";
import {IProductDetail} from "./[id]";
import {ProductDetail} from "../../model/ProductDetail";

export interface IProduct {
    id: string;
    name: string;
    thumbnail: string | null;
    shortDescription: string | null;
    status: boolean;
    minPrice: number;
    maxPrice: number;
    productDetails: IProductDetail[] | null;
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
                setProducts((response.content as Product[]).map((product): IProduct => {
                    return {
                        id: product.id,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        shortDescription: product.shortDescription,
                        status: product.status,
                        minPrice: Math.min(...product.productDetails.map((productDetail) => productDetail.price)),
                        maxPrice: Math.max(...product.productDetails.map((productDetail) => productDetail.price)),
                        productDetails: (product.productDetails as ProductDetail[]).map((productDetail: ProductDetail): IProductDetail => {
                            return {
                                id: productDetail.id,
                                name: productDetail.name,
                                price: productDetail.price,
                                description: productDetail.description,
                                images: productDetail.images,
                                status: productDetail.status
                            }
                        })
                    }
                }));
            })
            .catch(response => console.log(response))
    }

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