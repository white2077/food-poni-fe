import {Button, Result, Skeleton, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
import ProductCard from "./product-card";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {setProductList} from "../stores/product.reducer";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {Page} from "../models/Page";
import {ProductResponseDTO} from "../models/product/ProductResponseAPI";
import {ProductDetailResponseDTO} from "../models/product_detail/ProductDetailResponseAPI";
import {CurrentUser} from "../stores/user.reducer";
import {SmileOutlined} from "@ant-design/icons";

export interface IProductCard {
    id: string;
    name: string;
    thumbnail: string;
    minPrice: number;
    maxPrice: number;
    rate: number;
}

const ProductRows = () => {

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const {products, isLoading} = useSelector((state: RootState) => state.productList);

    const currentProductCategory: string = useSelector((state: RootState) => state.productCategory.currentProductCategory);

    const [pending, setPending] = useState<boolean>(false);

    useEffect((): void => {
        getProducts();
    }, [currentProductCategory]);

    const getProducts = (): void => {
        setPending(true);
        let url: string = "/products?status=true";
        if (currentProductCategory && currentProductCategory !== "all") {
            url += '&categoryId=' + currentProductCategory;
        }

        axiosConfig.get(url)
            .then((res: AxiosResponse<Page<ProductResponseDTO[]>>): void => {
                const productList: IProductCard[] = [];

                (res.data.content as ProductResponseDTO[]).map((product: ProductResponseDTO): void => {
                    if (currentUser.accessToken && currentUser.role === "RETAILER" && currentUser.id == product.user?.id) {
                        return;
                    }

                    const productDetails: ProductDetailResponseDTO[] = product.productDetails ?? [];
                    const prices: number[] = productDetails
                        .map((productDetail: ProductDetailResponseDTO) => productDetail.price)
                        .filter((price: number | undefined): price is number => price !== undefined);
                    const minPrice: number = prices.length > 0 ? Math.min(...prices) : 0;
                    const maxPrice: number = prices.length > 0 ? Math.max(...prices) : 0;

                    const productCard: IProductCard = {
                        id: product.id ?? "",
                        name: product.name ?? "",
                        thumbnail: product.thumbnail ?? "",
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        rate: product.rate ?? 0
                    };

                    productList.push(productCard);
                });

                dispatch(setProductList({products: productList, isLoading: false}));
                setPending(false);
            })
            .catch(err => {
                setPending(false);
                console.log(err);
            });
    };

    return (
        pending ? (
            <Spin style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }} size="large" />
        ) : (
            <>
                {products.length ?
                    (
                        <>
                            <Skeleton loading={isLoading} active/>
                            <div
                                className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                                {products.map((product: IProductCard) => (
                                    <ProductCard key={product.id} product={product}/>
                                ))}
                            </div>
                        </>
                    ) :
                    <Result
                        icon={<SmileOutlined/>}
                        title="Oops! No product found"
                    />
                }
            </>
        )
    );

};

export default ProductRows;