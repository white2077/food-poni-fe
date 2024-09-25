import { NextRouter, useRouter } from "next/router";
import { DefaultLayout } from "../_layout";
import React, { useEffect, useState } from "react";
import { Button, Card, notification, Radio, Rate, Result } from "antd";
import ProductGallery from "../../components/product-gallery";
import ProductCart from "../../components/product-cart";
import { AxiosResponse } from "axios";
import ProductComment from "../../components/product-comment";
import { AddressAPIResponse } from "../../models/address/AddressAPIResponse";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import { ParsedUrlQuery } from "querystring";
import { api } from "../../utils/axios-config";
import { server } from "../../utils/server";
import { ProductAPIResponse } from "../../models/product/ProductAPIResponse";
import { ProductDetailAPIResponse } from "../../models/product_detail/ProductDetailAPIResponse";
import { RateAPIResponse } from "../../models/rate/RateAPIResponse";
import { Page } from "../../models/Page";
import ReadMore from "../../components/read-more";
import { getProductById, getProductsCardPage } from "../../queries/product.query";
import RelatedProducts from "../../components/related-products";
import { getProductDetailsByProductId } from "../../queries/product-detail.query";
import Loading from "../../components/loading-product";
import Tym from "../../components/tym";

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
    rate: number;
    rateCount: number;
    sales: number;
    status: boolean;
}

export interface IRetailer {
    id: string;
    avatar: string;
    username: string;
}

export async function getServerSideProps(context: { params: ParsedUrlQuery }) {
    const { pid } = context.params;

    if (typeof pid !== 'string') {
        throw new Error('invalid pid');
    }

    try {
        const product: ProductAPIResponse = await getProductById(pid);
        const productDetails: Page<ProductDetailAPIResponse[]> = await getProductDetailsByProductId(pid);

        const productMapped: IProduct = {
            id: product.id,
            name: product.name,
            shortDescription: product.shortDescription,
            retailer: product.user && {
                id: product.user.id,
                avatar: product.user.avatar,
                username: product.user.username,
            },
            productDetails: productDetails.content.map((productDetail: ProductDetailAPIResponse): IProductDetail => ({
                id: productDetail.id,
                name: productDetail.name,
                price: productDetail.price,
                description: productDetail.description,
                images: productDetail.images,
                rate: productDetail.rate,
                rateCount: productDetail.rateCount,
                sales: productDetail.sales,
                status: productDetail.status
            }))
        };

        return { props: { product: productMapped } }
    } catch (e) {
        throw e;
    }
}

interface ProductDetailPageProps {
    product: IProduct
}

const ProductDetails = ({ product }: ProductDetailPageProps) => {

    const router: NextRouter = useRouter();

    const currentShippingAddress: AddressAPIResponse = useSelector((state: RootState) => state.address.shippingAddress);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const [isLoadingRate, setLoadingRate] = useState<boolean>(false);

    const [rates, setRates] = useState<RateAPIResponse[]>([]);

    useEffect(() => {
        if (product && product.productDetails && product.productDetails.length > 0) {
            setProductDetailSelected(product.productDetails[0]);
            getRates(product.productDetails && product.productDetails[0].id);
        }
    }, [product]);

    const getRates = (productDetailId: string | undefined) => {
        setLoadingRate(true);
        api.get(`/product-details/rate/${productDetailId}`)
            .then(function (res: AxiosResponse<Page<RateAPIResponse[]>>) {
                setRates(res.data.content);
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
        description,
        status
    } = productDetailSelected || {} as IProductDetail;

    const isOwnProduct = currentUser && product.retailer && currentUser.id === product.retailer.id;

    return (
        <DefaultLayout>
            {
                product.id && product.productDetails && product.productDetails.length > 0 ? (
                    <div className='grid gap-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_3fr_2fr] gap-4'>
                            <div className="lg:sticky top-5">
                                <ProductGallery images={images ?? []} />
                            </div>
                            <div className='grid gap-4 lg:order-1 order-2'>
                                <Card size='small'>
                                    <h2 className='text-xl'>{product.name + (productDetailName ? ' - ' + productDetailName : '')}</h2>
                                    <div className="my-2 flex flex-wrap items-center">
                                        <span className="border-r-2 py-1 pr-2 flex items-center">
                                            <span className="m-1 border-b-2 text-lg">{(productDetailSelected?.rate ? productDetailSelected.rate.toFixed(1) : 0) + ""}</span>
                                            <Rate allowHalf disabled value={productDetailSelected?.rate} className="text-xs mr-[8px]" />
                                        </span>
                                        <span className="border-r-2 py-1 px-1 hidden md:inline">
                                            <span className="text-lg m-1 border-b-2">{productDetailSelected?.rateCount}</span> Đánh giá
                                        </span>
                                        <span className="border-r-2 py-1 px-1">
                                            <span className="text-lg m-1 border-b-2">{productDetailSelected?.sales}</span> Lượt bán
                                        </span>
                                        <span className="flex items-center px-1">
                                            <Tym /> <span className=" ml-1">9999 Lượt thích</span>
                                        </span>
                                    </div>
                                    <h3 className='text-2xl font-semibold'>
                                        {price}
                                        <sup>₫</sup>
                                    </h3>
                                </Card>
                                <Card hidden={product.productDetails?.length == 1} size='small' title='Loại sản phẩm' className="static">
                                    {(product.productDetails && product.productDetails.length > 1) && (
                                        <Radio.Group defaultValue={product.productDetails[0].name || "default"}>
                                            {(product?.productDetails || []).map((productDetail: IProductDetail) => (
                                                <Radio.Button key={productDetail.id} value={productDetail.name || "default"} onClick={() => changeProductDetailSelected(productDetail)} className="!rounded-lg m-2 static hover:static border-[1px]">
                                                    {productDetail.name || "Default"}
                                                </Radio.Button>
                                            ))}
                                        </Radio.Group>
                                    )}
                                </Card>
                                <Card size='small' title='Thông tin vận chuyển' hidden={currentShippingAddress.id === ""}>
                                    <Loading loading={Object.keys(currentShippingAddress).length === 0}>
                                        {currentShippingAddress.address}
                                    </Loading>
                                </Card>
                                <Card size='small' title='Mô tả ngắn'>
                                    <div className="text-black" dangerouslySetInnerHTML={{ __html: product.shortDescription || '' }}></div>
                                </Card>
                                <RelatedProducts title="Sản phẩm liên quan" query={getProductsCardPage({ page: 0, pageSize: 20, status: true })} />
                                <ReadMore content={description} />
                            </div>
                            <div className="lg:sticky top-5 lg:order-2 order-1">
                                {!isOwnProduct ? (
                                    <ProductCart
                                        id={id!}
                                        price={price!}
                                        thumbnail={images && images.length > 0 ? server + images[0] : ""}
                                        name={product.name + (productDetailName ? ' - ' + productDetailName : '')}
                                        retailer={product.retailer!}
                                        status={status!}
                                    />
                                ) : (
                                    <Card size='small'>
                                        <p>Bạn không thể mua sản phẩm của chính mình.</p>
                                    </Card>
                                )}
                            </div>
                        </div>
                        <ProductComment data={rates} productDetailSelected={productDetailSelected ?? {} as IProductDetail} isLoading={isLoadingRate} />
                    </div>
                ) : (
                    <Result
                        status="404"
                        title="404"
                        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại"
                        extra={<Button type="primary" onClick={() => router.push('/')}>Tiếp tục mua sắm</Button>}
                    />
                )
            }
        </DefaultLayout>
    );
};

export default ProductDetails;
