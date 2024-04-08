import {List} from 'antd';
import type {NextPage} from 'next'
import React, {useEffect} from 'react'
import {Product} from "../model/Product";
import ProductCard from "./product-card";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {setLoading, setProductList} from "../store/product.reducer";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {Page} from "../model/Common";

export interface IProductCard {
    id: string;
    name: string;
    thumbnail: string;
    minPrice: number;
    maxPrice: number;
}

const ProductRows: NextPage = () => {
    const dispatch = useDispatch();
    const {products, isLoading} = useSelector((state: RootState) => state.productList);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = (): void => {
        axiosConfig.get("/products")
            .then((res: AxiosResponse<Page<Product[]>>) => {
                const productList = (res.data.content as Product[]).map((product): IProductCard => {
                    return {
                        id: product.id,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        minPrice: Math.min(...product.productDetails.map((productDetail) => productDetail.price)),
                        maxPrice: Math.max(...product.productDetails.map((productDetail) => productDetail.price)),
                    };
                });

                dispatch(setProductList({products:productList, isLoading: false}));
            })
            .catch(err => {
                console.log(err)
            })
    };

    return (
        <List
            loading={isLoading}
            grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4}}
            dataSource={products}
            renderItem={(product) => (
                <List.Item id={product.id}>
                    <ProductCard product={product}/>
                </List.Item>
            )}
        />
    );

}

export default ProductRows