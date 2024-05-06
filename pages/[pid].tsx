import type {NextPage} from 'next'
import {NextRouter, useRouter} from "next/router";
import {DefaultLayout} from "../components/layout";
import React, {useEffect, useState} from "react";
import {Button, Card, notification, Radio, Rate, Result} from "antd";
import ProductGallery from "../components/product-gallery";
import ProductCart from "../components/product-cart";
import {ProductResponseDTO} from "../models/product/ProductResponseAPI";
import {ProductDetailResponseDTO} from "../models/product_detail/ProductDetailResponseAPI";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import ProductComment from "../components/product-comment";
import {RateResponseDTO} from "../models/rate/RateResponseAPI";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {CurrentUser} from "../stores/user.reducer";

export interface IProduct {
    id?: string;
    name?: string;
    shortDescription?: string;
    productDetails?: IProductDetail[];
    retailer?: IRetailer;
}

export interface IProductDetail {
    id?: string;
    name?: string;
    price?: number,
    description?: string;
    images?: string[];
    rate?: number;
    sales?: number;
    rateCount?: number;
}

export interface IRetailer {
    id?: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    username?: string;
}

const ProductDetails: NextPage = () => {

    const router: NextRouter = useRouter();

    const {pid} = router.query;

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const currentShippingAddress: AddressResponseDTO = useSelector((state: RootState) => state.address.shippingAddress);

    const [product, setProduct] = useState<IProduct>();

    const [isError, setIsError] = useState<boolean>(false);

    const [isLoadingRate, setLoadingRate] = useState<boolean>(false);

    const [rates, setRates] = useState<RateResponseDTO[]>([]);

    useEffect((): void => {
        getProductDetailById();
    }, [router.isReady]);

    const getProductDetailById = (): void => {
        if (pid) {
            axiosConfig.get(`/products/${pid}`)
                .then(function (res: AxiosResponse<ProductResponseDTO>): void {
                    const product: ProductResponseDTO = res.data;
                    // console.log(res.data)
                    const productMapped: IProduct = {
                        id: product.id ?? "",
                        name: product.name ?? "",
                        shortDescription: product.shortDescription ?? "",
                        retailer: product.user && {
                            id: product.user.id ?? "",
                            avatar: product.user.avatar ?? "",
                            firstName: product.user.firstName ?? "",
                            lastName: product.user.lastName ?? "",
                            phoneNumber: product.user.phoneNumber ?? "",
                            username: product.user.username ?? "",
                        },
                        productDetails: product.productDetails && product.productDetails.map((productDetail: ProductDetailResponseDTO): IProductDetail => {
                            return {
                                id: productDetail.id ?? "",
                                name: productDetail.name ?? "",
                                price: productDetail.price ?? 0,
                                description: productDetail.description ?? "",
                                images: productDetail.images ?? [],
                                rate: productDetail.rate ?? 0,
                                sales: productDetail.sales ?? 0,
                                rateCount: productDetail.rateCount ?? 0,
                            }
                        })
                    };
                    getRates(productMapped.productDetails && productMapped.productDetails[0].id);
                    setProduct(productMapped);
                    setProductDetailSelected(productMapped.productDetails && productMapped.productDetails[0]);
                })
                .catch(function (): void {
                    setIsError(true);
                });
        }
    };

    const getRates = (productDetailId: string | undefined) => {
        setLoadingRate(true);
        axiosConfig.get(`/products/rate/${productDetailId}`)
            .then(function (res: AxiosResponse<RateResponseDTO[]>) {
                // console.log(res.data);
                setRates(res.data);
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Order message',
                    description: res.message
                });
            }).finally(() => {
            setLoadingRate(false);
        })
    }

    const [productDetailSelected, setProductDetailSelected] = useState<IProductDetail>();

    const changeProductDetailSelected = (productDetail: IProductDetail): void => {
        setProductDetailSelected(productDetail);
        getRates(productDetail.id);
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
                        <div className='grid gap-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_3fr_2fr] gap-4'>
                                <ProductGallery images={images ?? []}/>
                                <div className='grid gap-4'>
                                    <Card size='small'>
                                        <h2 className='text-xl'>{product.name + (productDetailName ? ' - ' + productDetailName : '')}</h2>
                                        <div className="my-2">
                                            <span className="border-r-2 py-1 pr-2">
                                                <span className="m-1 border-b-2 text-lg">
                                                    {(productDetailSelected?.rate ? productDetailSelected.rate.toFixed(1) : 0) + " "}
                                                </span>
                                                <Rate allowHalf disabled value={productDetailSelected?.rate}
                                                      style={{fontSize: '12px', marginRight: '8px'}}/>
                                            </span>
                                            <span className="border-r-2 py-1 px-4 hidden md:inline">
                                                <span className="text-lg m-1 border-b-2">{productDetailSelected?.rateCount}</span> Đánh Giá</span>
                                            <span className="border-r-2 py-1 px-4">
                                                <span className="text-lg m-1 border-b-2">{productDetailSelected?.sales}</span> Lượt Bán</span>
                                        </div>
                                        <h3 className='text-2xl font-semibold'>${price}</h3>
                                    </Card>
                                    <Card size='small' title='Product type'>
                                        {(product.productDetails && product.productDetails.length > 1) && (
                                            <Radio.Group defaultValue={productDetailName || "default"}>
                                                {(product?.productDetails || []).map((productDetail: IProductDetail) => (
                                                    <Radio.Button key={productDetail.id}
                                                                  value={productDetail.name || "default"}
                                                                  onClick={() => changeProductDetailSelected(productDetail)}>
                                                        {productDetail.name || "Default"}
                                                    </Radio.Button>
                                                ))}
                                            </Radio.Group>
                                        )}
                                    </Card>
                                    {(currentUser.accessToken && currentShippingAddress) &&
                                        <Card size='small' title='Shipping information'>
                                            <div>{currentShippingAddress.address}</div>
                                        </Card>
                                    }
                                    <Card size='small' title='Short description'>
                                        <div style={{color: 'black'}}
                                             dangerouslySetInnerHTML={{__html: product.shortDescription || ''}}></div>
                                    </Card>
                                    <Card size='small' title='Description'>
                                        <div style={{color: 'black'}}
                                             dangerouslySetInnerHTML={{__html: description || ''}}></div>
                                    </Card>
                                </div>

                                <ProductCart
                                    id={id!}
                                    price={price!}
                                    thumbnail={images![0]}
                                    name={product.name + ' - ' + productDetailName}
                                    retailer={product.retailer!}
                                />
                            </div>
                            <ProductComment data={rates} isLoading={isLoadingRate}/>
                        </div>
                    )}
                </>
            )}
        </DefaultLayout>
    );
};

export default ProductDetails;
