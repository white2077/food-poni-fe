import {NextRouter, useRouter} from "next/router";
import {DefaultLayout} from "./_layout";
import React, {useEffect, useState} from "react";
import {Button, Card, notification, Radio, Rate, Result} from "antd";
import ProductGallery from "../components/product-gallery";
import ProductCart from "../components/product-cart";
import {AxiosResponse} from "axios";
import ProductComment from "../components/product-comment";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {ParsedUrlQuery} from "querystring";
import {api} from "../utils/axios-config";
import {server} from "../utils/server";
import {ProductAPIResponse} from "../models/product/ProductAPIResponse";
import {ProductDetailAPIResponse} from "../models/product_detail/ProductDetailAPIResponse";
import {RateAPIResponse} from "../models/rate/RateAPIResponse";
import {Page} from "../models/Page";
import ReadMore from "../components/read_more";
import Banner from "../components/slide-banner";
import ProductRows from "../components/product-rows";
import {getProductsPage} from "../queries/product.query";
import RelatedProducts from "../components/related-products";

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
    const {pid} = context.params;
    try {
        const resProduct: AxiosResponse<ProductAPIResponse> = await api.get('/products/' + pid);
        const product: ProductAPIResponse = resProduct.data;

        const resProductDetails: AxiosResponse<Page<ProductDetailAPIResponse[]>> = await api.get('/product-details/products/' + pid);
        const productDetails: Page<ProductDetailAPIResponse[]> = resProductDetails.data;

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

        return {
            props: {
                product: productMapped,
            },
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        return {
            props: {
                product: null,
            },
        };
    }
}

const ProductDetails = ({product}: { product: IProduct }) => {

    const router: NextRouter = useRouter();

    const currentShippingAddress: AddressAPIResponse = useSelector((state: RootState) => state.address.shippingAddress);

    const [isError, setIsError] = useState<boolean>(false);

    const [isLoadingRate, setLoadingRate] = useState<boolean>(false);

    const [rates, setRates] = useState<RateAPIResponse[]>([]);

    useEffect(() => {
        if (product && product.productDetails && product.productDetails.length > 0) {
            setProductDetailSelected(product.productDetails[0]);
            getRates(product.productDetails && product.productDetails[0].id);
        } else if (product == null) {
            setIsError(true);
        }
    }, [product]);

    const getRates = (productDetailId: string | undefined) => {
        setLoadingRate(true);
        api.get(`/product-details/rate/${productDetailId}`)
            .then(function (res: AxiosResponse<Page<RateAPIResponse>>) {
                setRates(Array.isArray(res.data.content) ? res.data.content : []);
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
    } = productDetailSelected || {};

    return (
        <DefaultLayout>
            {isError ? (
                <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>} />
            ) : (
                <>
                    {product && (
                        <div className='grid gap-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_3fr_2fr] gap-4'>
                                <div className="sticky top-5">
                                    <ProductGallery images={images ?? []}/>
                                </div>
                                <div className='grid gap-4'>
                                    <Card size='small'>
                                        <h2 className='text-xl'>{product.name + (productDetailName ? ' - ' + productDetailName : '')}</h2>
                                        <div className="my-2">
                                            <span className="border-r-2 py-1 pr-2">
                                                <span
                                                    className="m-1 border-b-2 text-lg">{(productDetailSelected?.rate ? productDetailSelected.rate.toFixed(1) : 0) + ""}</span>
                                                <span>
                                                </span>
                                                <Rate allowHalf disabled value={productDetailSelected?.rate}
                                                      className="text-xs mr-[8px]"
                                                />
                                            </span>
                                            <span className="border-r-2 py-1 px-4 hidden md:inline">
                                                <span
                                                    className="text-lg m-1 border-b-2">{productDetailSelected?.rateCount}</span> Đánh giá</span>
                                            <span className="border-r-2 py-1 px-4">
                                                <span
                                                    className="text-lg m-1 border-b-2">{productDetailSelected?.sales}</span> Lượt bán</span>
                                        </div>
                                        <h3 className='text-2xl font-semibold'>${price}</h3>
                                    </Card>
                                    <Card hidden={product.productDetails?.length == 1} size='small'
                                          title='Loại sản phẩm' className="static">
                                        {(product.productDetails && product.productDetails.length > 1) && (
                                            <Radio.Group defaultValue={product.productDetails[0].name || "default"}>
                                                {(product?.productDetails || []).map((productDetail: IProductDetail) => (
                                                    <Radio.Button key={productDetail.id}
                                                                  value={productDetail.name || "default"}
                                                                  onClick={() => changeProductDetailSelected(productDetail)}
                                                                  className="!rounded-lg m-2 static hover:static border-[1px]"
                                                    >
                                                        {productDetail.name || "Default"}
                                                    </Radio.Button>
                                                ))}
                                            </Radio.Group>
                                        )}
                                    </Card>
                                    <Card size='small' title='Thông tin vận chuyển'
                                          loading={Object.keys(currentShippingAddress).length === 0} hidden={currentShippingAddress.id === ""}>
                                        <div>{currentShippingAddress.address}</div>
                                    </Card>
                                    <Card size='small' title='Mô tả ngắn'>
                                        <div className="text-black"
                                             dangerouslySetInnerHTML={{__html: product.shortDescription || ''}}></div>
                                    </Card>
                                    <RelatedProducts
                                        title="Sản phẩm liên quan"
                                        query={getProductsPage({status: true})}
                                    />
                                    <ReadMore content={description}/>
                                </div>
                              <div className="sticky top-5">
                                  <ProductCart
                                      id={id!}
                                      price={price!}
                                      thumbnail={images && images.length > 0 ? server + images[0] : ""}
                                      name={product.name + (productDetailName ? ' - ' + productDetailName : '')}
                                      retailer={product.retailer!}
                                      status={status!}
                                  />
                              </div>
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
