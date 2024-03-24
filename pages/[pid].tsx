import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {DefaultLayout} from "../components/layout";
import React, {useEffect, useState} from "react";
import {Product} from "../model/Product";
import {ProductDetail} from "../model/ProductDetail";
import {Card, Col, Radio, Rate, Row} from "antd";
import ImageProductDetail from "../components/image-product-detail";
import AddToCard from "../components/add-to-card";
import {server} from "../utils/server";

export interface IProduct {
    id: string;
    name: string | null;
    shortDescription: string | null;
    productDetails: IProductDetail[];
}

export interface IProductDetail {
    id: string;
    name: string | null;
    price: number,
    description: string | null;
    images: string[] | null
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
                })
                .catch(response => console.log(response))
        }
    }

    const [productDetailSelected, setProductDetailSelected] = useState<IProductDetail>();

    const changeProductDetailSelected = (productDetail: IProductDetail) => {
        setProductDetailSelected(productDetail);
    }

    const {name: productName, shortDescription} = product || {};
    const {
        images,
        name: productDetailName,
        price,
        description
    } = productDetailSelected || product?.productDetails.at(0) || {};

    return (
        <DefaultLayout>
            {(product) && (
                <Row gutter={[16, 16]}>
                    <Col flex={3}>
                        <ImageProductDetail images={images}/>
                    </Col>
                    <Col flex={4}>
                        <div style={{textAlign: 'left'}}>
                            <Card>
                                <div>
                                    {productName + (productDetailName ? ' - ' + productDetailName : "")}
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
                            <Card>
                                <div>Mô tả ngắn</div>
                                <div style={{color: 'black'}}
                                     dangerouslySetInnerHTML={{__html: shortDescription || ''}}></div>
                            </Card>
                            <Card>
                                <div>Mô tả sản phẩm</div>
                                <div style={{color: 'black'}}
                                     dangerouslySetInnerHTML={{__html: description || ''}}></div>
                            </Card>
                        </div>
                    </Col>
                    <Col flex={3}>
                        <AddToCard price={price}/>
                    </Col>
                </Row>
            )}
        </DefaultLayout>
    );
}

export default ProductDetails
