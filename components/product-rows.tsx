import {Card, notification, Result, Skeleton, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
import ProductCard, {DistanceResponse} from "./product-card";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {setProductList} from "../stores/product.reducer";
import axios, {AxiosResponse} from "axios";
import {Page} from "../models/Page";
import {ProductResponseDTO} from "../models/product/ProductResponseAPI";
import {ProductDetailResponseDTO} from "../models/product_detail/ProductDetailResponseAPI";
import {CurrentUser} from "../stores/user.reducer";
import {SmileOutlined} from "@ant-design/icons";
import {accessToken, api} from "../utils/axios-config";
import MenuMain from "./menu-main";
import {OrderItemResponseDTO} from "../models/order_item/OrderItemResponseAPI";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";

export interface IProductCard {
    id: string;
    name: string;
    thumbnail: string;
    minPrice: number;
    maxPrice: number;
    rate: number;
    retailer: string;
    rateCount: number;
    quantityCount: number;
    createdDate: Date;
}

const ProductRows = () => {

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const {products, isLoading} = useSelector((state: RootState) => state.productList);

    const currentProductCategory: string = useSelector((state: RootState) => state.productCategory.currentProductCategory);

    const currentMainMenu: string = useSelector((state: RootState) => state.mainMenu.currentMainMenu);

    const [pending, setPending] = useState<boolean>(false);

    const shippingAddress: AddressResponseDTO = useSelector((state: RootState) => state.address.shippingAddress);

    const selectedAddress = useSelector((state: RootState) => state.searchPosition.searchPosition);

    useEffect((): void => {
        getProducts();
    }, [currentProductCategory, currentMainMenu]);

    const getProducts = (): void => {
        setPending(true);
        let url: string = "/products?status=true";
        if (currentProductCategory && currentProductCategory !== "all") {
            url += '&categoryId=' + currentProductCategory;
        }

        api.get(url)
            .then((res: AxiosResponse<Page<ProductResponseDTO[]>>): void => {
                const productList: IProductCard[] = [];
                (res.data.content as ProductResponseDTO[]).map((product: ProductResponseDTO): void => {
                    if (currentUser.role === "RETAILER" && currentUser.id == product.user?.id) {
                        return;
                    }

                    const productDetails: ProductDetailResponseDTO[] = product.productDetails ?? [];
                    const prices: number[] = productDetails
                        .map((productDetail: ProductDetailResponseDTO) => productDetail.price)
                        .filter((price: number | undefined): price is number => price !== undefined);
                    const minPrice: number = prices.length > 0 ? Math.min(...prices) : 0;
                    const maxPrice: number = prices.length > 0 ? Math.max(...prices) : 0;

                    let rateSum: number = 0;
                    let rateCount: number = 0;
                    let quantityCount: number = 0;

                    productDetails.forEach((productDetail: ProductDetailResponseDTO) => {
                        productDetail.orderItems?.forEach((orderItem: OrderItemResponseDTO) => {
                            const quantity: number = orderItem.quantity ?? 0;
                            quantityCount += quantity;

                            if (orderItem.rate) {
                                rateSum += orderItem.rate.rate;
                                rateCount++;
                            }
                        });
                    });

                    const averageRate: number = rateCount > 0 ? rateSum / rateCount : 0;

                    const productCard: IProductCard = {
                        id: product.id ?? "",
                        name: product.name ?? "",
                        thumbnail: product.thumbnail ?? "",
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        rate: averageRate,
                        retailer: product.user?.username ?? "",
                        rateCount: rateCount,
                        quantityCount: quantityCount,
                        createdDate: product.createdDate
                    };

                    productList.push(productCard);
                });

                let filteredProductList: IProductCard[] = productList;

                if (currentMainMenu && currentMainMenu != "all") {
                    switch (currentMainMenu) {
                        case "nearby":
                            // Logic để lọc sản phẩm gần bạn
                            filteredProductList = filterByNearby(productList);
                            console.log(currentMainMenu);
                            break;
                        case "promotion":
                            // Logic để lọc sản phẩm khuyến mãi
                            filteredProductList = filterByPromotion(productList);
                            console.log(currentMainMenu);
                            break;
                        case "bestnews":
                            // Logic để lọc sản phẩm mới nhất
                            filteredProductList = filterByNewest(productList);
                            console.log(currentMainMenu);
                            break;
                        case "bestsellers":
                            // Logic để lọc sản phẩm bán chạy nhất
                            filteredProductList = filterByBestSellers(productList);
                            console.log(currentMainMenu);
                            break;
                        case "toprates":
                            // Logic để lọc sản phẩm đánh giá hàng đầu
                            filteredProductList = filterByTopRates(productList);
                            console.log(currentMainMenu);
                            break;
                        default:
                            break;
                    }
                }

                dispatch(setProductList({products: filteredProductList, isLoading: false}));
                setPending(false);
            })
            .catch(err => {
                setPending(false);
                console.log(err);
            });
    };

    const filterByNearby = (products: IProductCard[]): IProductCard[] => {
        // return products.sort((a, b) => parseFloat(b.distance) - parseFloat(a.distance));
        return products;
    };

    const filterByPromotion = (products: IProductCard[]): IProductCard[] => {
        return products;
    };

    const filterByNewest = (products: IProductCard[]): IProductCard[] => {
        return products.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    };

    const filterByBestSellers = (products: IProductCard[]): IProductCard[] => {
        return products.sort((a, b) => b.quantityCount - a.quantityCount);
    };

    const filterByTopRates = (products: IProductCard[]): IProductCard[] => {
        return products.sort((a, b) => b.rate - a.rate);
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
                        <div className="p-4 bg-white rounded-lg">
                            <div>Top Deal - Siêu rẻ</div>
                            <Skeleton loading={isLoading} active/>
                            <MenuMain/>
                            <div
                                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                {products.map((product: IProductCard) => (
                                    <ProductCard key={product.id} product={product}/>
                                ))}
                            </div>
                        </div>
                    ) :
                    <Result
                        icon={<SmileOutlined/>}
                        title="Không tìm thấy sản phẩm nào!"
                    />
                }
            </>
        )
    );

};

export default ProductRows;