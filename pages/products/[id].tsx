import type {NextPage} from 'next'
import {useRouter} from "next/router";
import {DefaultLayout} from "../../components/layout";
import React, {useEffect, useState} from "react";
import {Product} from "../../model/Product";
import {ProductDetail} from "../../model/ProductDetail";
import ProductDetailComponent from "../../components/product-detail.component";

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
    const {id} = router.query;
    const [product, setProduct] = useState<IProduct>();

    useEffect(() => {
        getProductDetailById();
    }, []);

    const getProductDetailById = (): void => {
        fetch(`http://localhost:8080/api/v1/products/${id}`)
            .then(
                response => response.json())
            .then(response => {
                const product: Product = response;

                // @ts-ignore
                const mappedProductl: IProduct = {
                    id: product.id,
                    name: product.name,
                    shortDescription: product.shortDescription,
                    productDetails: (product.productDetails as ProductDetail[]).map((productDetail: ProductDetail): IProductDetail => {
                        return {
                            id: productDetail.id,
                            name: productDetail.name,
                            price: productDetail.price,
                            description: productDetail.description,
                            images: productDetail.images
                        }
                    })
                };

                setProduct(mappedProductl);
            })
            .catch(response => console.log(response))
    }

    return (
        <DefaultLayout>
            <ProductDetailComponent product={product ? product : null} firstProductDetail={product?.productDetails ? product.productDetails?.[0] : null}></ProductDetailComponent>
        </DefaultLayout>
    );
}

export default ProductDetails
