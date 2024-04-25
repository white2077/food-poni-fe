import {List} from 'antd';
import type {NextPage} from 'next'
import React, {useEffect} from 'react';
import ProductCard from "./product-card";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {setProductList} from "../store/product.reducer";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {Page} from "../model/Common";
import {ProductResponseDTO} from "../model/product/ProductResponseAPI";
import {ProductDetailResponseDTO} from "../model/product_detail/ProductDetailResponseAPI";

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

    useEffect((): void => {
        getProducts();
    }, []);

    const getProducts = (): void => {

        axiosConfig.get("/products")
            .then((res: AxiosResponse<Page<ProductResponseDTO[]>>): void => {
                const productList: IProductCard[] = (res.data.content as ProductResponseDTO[]).map((product: ProductResponseDTO): IProductCard => {
                    return {
                        id: product.id,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        minPrice: Math.min(...product.productDetails.map((productDetail: ProductDetailResponseDTO) => productDetail.price)),
                        maxPrice: Math.max(...product.productDetails.map((productDetail: ProductDetailResponseDTO) => productDetail.price)),
                    };
                });

                dispatch(setProductList({products:productList, isLoading: false}));
            })
            .catch(err => {
                console.log(err)
            });

    };

    return (
        <List
            loading={isLoading}
            grid={{gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4}}
            dataSource={products}
            renderItem={(product: IProductCard) => (
                <List.Item id={product.id}>
                    <ProductCard product={product}/>
                </List.Item>
            )}
        />
    );

};

export default ProductRows;