import type {NextPage} from 'next'
import {NextRouter, useRouter} from "next/router";
import {DefaultLayout} from "../components/layout";
import React, {useEffect, useState} from "react";
import {Button, Card, Col, Radio, Rate, Result, Row} from "antd";
import ProductGallery from "../components/product-gallery";
import ProductCart from "../components/product-cart";
import ProductDescriptionComponent from "../components/product-description";
import ProductRetailer from "../components/product-retailer";
import {ProductResponseDTO} from "../models/product/ProductResponseAPI";
import {ProductDetailResponseDTO} from "../models/product_detail/ProductDetailResponseAPI";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";

export interface IProduct {
    id: string;
    name: string;
    shortDescription: string;
    productDetails: IProductDetail[];
    retailer: IRetailer;
}

export interface IProductDetail {
    id: string;
    name: string;
    price: number,
    description: string;
    images: string[];
}

export interface IRetailer {
    avatar: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

const ProductDetails: NextPage = () => {

    const router: NextRouter = useRouter();

    const {pid} = router.query;

    const [product, setProduct] = useState<IProduct>();

    const [isError, setIsError] = useState<boolean>(false);

    useEffect((): void => {
        getProductDetailById();
    }, [router.isReady]);

    const getProductDetailById = (): void => {
        if (pid) {
            axiosConfig.get(`/products/${pid}`)
                .then(function (res: AxiosResponse<ProductResponseDTO>): void {
                    const product: ProductResponseDTO = res.data;

                    const productMapped: IProduct = {
                        id: product.id ?? "",
                        name: product.name ?? "",
                        shortDescription: product.shortDescription ?? "",
                        retailer: product.user ? {
                            avatar: product.user.avatar ?? "",
                            firstName: product.user.firstName ?? "",
                            lastName: product.user.lastName ?? "",
                            phoneNumber: product.user.phoneNumber ?? "",
                        } : {
                            avatar: "",
                            firstName: "",
                            lastName: "",
                            phoneNumber: "",
                        },
                        productDetails: product.productDetails && product.productDetails.map((productDetail: ProductDetailResponseDTO): IProductDetail => {
                            return {
                                id: productDetail.id ?? "",
                                name: productDetail.name ?? "",
                                price: productDetail.price ?? 0,
                                description: productDetail.description ?? "",
                                images: productDetail.images ?? []
                            }
                        }) || []
                    };

                    setProduct(productMapped);
                    setProductDetailSelected(productMapped.productDetails[0]);
                })
                .catch(function (): void {
                    setIsError(true);
                });
        }
    };

    const [productDetailSelected, setProductDetailSelected] = useState<IProductDetail>();

    const changeProductDetailSelected = (productDetail: IProductDetail): void => {
        setProductDetailSelected(productDetail);
    }

    const {
        id,
        images,
        name: productDetailName,
        price,
        description
    } = productDetailSelected || {};

    return (
        <DefaultLayout>
            {isError ? (<Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>}
            />) : (
                <>
                    {product && (
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_3fr_2fr] gap-4'>
                            <ProductGallery images={images}/>

                            <div className='grid gap-4'>
                                <Card>
                                    <h2 style={{marginTop: '0'}}>
                                        {product.name + (productDetailName ? ' - ' + productDetailName : '')}
                                    </h2>
                                    <Rate allowHalf defaultValue={4.5}
                                          style={{fontSize: '12px', marginRight: '8px'}}/>
                                    <span>Đã bán 500</span>
                                    <h3>${price}</h3>
                                    {(product && product.productDetails && product.productDetails.length > 1) && (
                                        <>
                                            <div>Loại</div>
                                            <Radio.Group defaultValue={productDetailName || "default"}>
                                                {(product?.productDetails || []).map((productDetail) => (
                                                    <Radio.Button key={productDetail.id}
                                                                  value={productDetail.name || "default"}
                                                                  onClick={() => changeProductDetailSelected(productDetail)}>
                                                        {productDetail.name || "Default"}
                                                    </Radio.Button>
                                                ))}
                                            </Radio.Group>
                                        </>
                                    )}
                                </Card>
                                <Card>
                                    <div>Thông tin vận chuyển</div>
                                    <div>Giao đến Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội</div>
                                </Card>
                                <ProductRetailer retailer={product.retailer}></ProductRetailer>
                                <ProductDescriptionComponent
                                    description={description!}
                                    shortDescription={product.shortDescription}
                                ></ProductDescriptionComponent>
                            </div>

                            <ProductCart
                                id={id!}
                                price={price!}
                                thumbnail={images![0]}
                                name={product.name + ' - ' + productDetailName}
                            />

                        </div>
                    )}
                </>
            )}
        </DefaultLayout>
    );
};

export default ProductDetails;
