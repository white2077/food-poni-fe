import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {DefaultLayout} from "../components/layout";
import React, {useEffect, useState} from "react";
import {Product} from "../model/Product";
import {ProductDetail} from "../model/ProductDetail";
import {Card, Col, Radio, Rate, Row} from "antd";
import ProductGallery from "../components/product-gallery";
import ProductCart from "../components/product-cart";
import {server} from "../utils/server";
import ProductDescriptionComponent from "../components/product-description";
import ProductRetailer from "../components/product-retailer";
import Title from "antd/lib/typography/Title";

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
    images: string[]
}

export interface IRetailer {
    avatar: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

const ProductDetails: NextPage = () => {
    const router = useRouter();
    const {pid} = router.query;
    const [product, setProduct] = useState<IProduct>();

    useEffect(() => {
        getProductDetailById();
    }, [router.isReady]);

    const getProductDetailById = (): void => {
        if (pid) {
            fetch(`${server}/products/${pid}`)
                .then(
                    response => response.json())
                .then(response => {
                    const product: Product = response;

                    // @ts-ignore
                    const productMapped: IProduct = {
                        id: product.id,
                        name: product.name,
                        shortDescription: product.shortDescription,
                        retailer: product.user,
                        productDetails: product.productDetails.map((productDetail: ProductDetail): IProductDetail => {
                            return {
                                id: productDetail.id,
                                name: productDetail.name,
                                price: productDetail.price,
                                description: productDetail.description,
                                images: productDetail.images
                            }
                        })
                    };

                    setProduct(productMapped);
                    setProductDetailSelected(productMapped.productDetails[0]);
                })
                .catch(response => console.log(response))
        }
    }

    const [productDetailSelected, setProductDetailSelected] = useState<IProductDetail>();

    const changeProductDetailSelected = (productDetail: IProductDetail) => {
        setProductDetailSelected(productDetail);
    }

    const {
        images,
        name: productDetailName,
        price,
        description
    } = productDetailSelected || {};

    return (
        <DefaultLayout>
            {product && (
                <Row gutter={[16, 16]}>
                    <Col flex={3}>
                        <ProductGallery images={images}/>
                    </Col>
                    <Col flex={4}>
                        <div style={{textAlign: 'left'}}>
                            <Card>
                                <div>
                                    {product.name + (productDetailName ? ' - ' + productDetailName : '')}
                                </div>
                                <Rate allowHalf defaultValue={4.5} style={{fontSize: '12px', marginRight: '8px'}}/>
                                <span>Đã bán 500</span>
                                <div>${price}</div>
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
                    </Col>
                    <Col flex={3}>
                        <ProductCart
                            id={productDetailSelected.id}
                            price={price}
                            thumbnail={images.at(0)}
                            name={product.name + ' - ' + productDetailName}
                        />
                    </Col>
                </Row>
            )}
        </DefaultLayout>
    );
}

export default ProductDetails
