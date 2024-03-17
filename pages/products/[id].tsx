import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {DefaultLayout} from "../../components/layout";
import Description from "../../components/description";
import React, {useEffect, useState} from "react";
import {IProduct} from "./all-product";
import {Product} from "../../model/Product";
import {ProductDetail} from "../../model/ProductDetail";
import ImageProductDetail from "../../components/image-product-detail.";
import {Card, Col, Row} from "antd";

export interface IProductDetail {
    id: string;
    name: string;
    price: number | null;
    description: string | null;
    images: string[] | null;
    status: boolean;
}

const ProductDetails: NextPage = () => {
    const router = useRouter();
    const {id} = router.query;
    const [product, setProduct] = useState<IProduct>();
    const defaultProduct: IProduct = {
        id: "",
        name: "",
        thumbnail: null,
        shortDescription: null,
        status: false,
        minPrice: 0,
        maxPrice: 0,
        productDetails: []
    }

    useEffect(() => {
        getProductDetailById();
    }, []);

    const getProductDetailById = (): void => {
        fetch(`http://localhost:8080/api/v1/products/${id}`)
            .then(
                response => response.json())
            .then(response => {
                const product: Product = response.result;

                const mappedProductDetail: IProduct = {
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
                };

                setProduct(mappedProductDetail);
            })
            .catch(response => console.log(response))
    }

    return (
        <DefaultLayout>
            <Row gutter={[16, 16]}>
                <Col flex={3}>
                    <ImageProductDetail images={product?.productDetails?.[0].images}></ImageProductDetail>
                </Col>
                <Col flex={4}>
                    <Description product={product ? product : defaultProduct}></Description>
                </Col>
                <Col flex={3}>
                    <Card size='small'>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                        <div style={{color: 'black'}}>Ghét anh Linh</div>
                    </Card>
                </Col>
            </Row>
        </DefaultLayout>
    );
}

export default ProductDetails
