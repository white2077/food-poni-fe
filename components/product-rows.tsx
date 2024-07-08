import {Card, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
import ProductCard from "./product-card";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {CurrentUser} from "../stores/user.reducer";
import MenuMain from "./menu-main";
import {getProductsPage} from "../queries/product.query";
import {ProductAPIResponse} from "../models/product/ProductAPIResponse";
import {ProductDetailAPIResponse} from "../models/product_detail/ProductDetailAPIResponse";
import {OrderItemAPIResponse} from "../models/order_item/OrderItemResponseAPI";
import ProductRowLoading from "./product-row-skeleton";
import {log} from "util";

export interface IProductCard {
    index: number,
    id: string;
    name: string;
    thumbnail: string;
    minPrice: number;
    maxPrice: number;
    rate: number;
    retailer: string;
    rateCount: number;
    sales: number;
    createdDate: Date;
}

const ProductRows = () => {

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [productCards, setProductCards] = useState<IProductCard[]>([]);

    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect((): void => {
        setLoading(true);
        getProductsPage({status: true})
            .then((res: Page<ProductAPIResponse[]>) => {
                let productCards: IProductCard[] = res.content.map((product: ProductAPIResponse, index: number) => {
                    return {
                        index,
                        id: product.id,
                        name: product.name,
                        thumbnail: product.thumbnail,
                        minPrice: Math.min(...product.productDetails.map((detail: ProductDetailAPIResponse) => detail.price)),
                        maxPrice: Math.max(...product.productDetails.map((detail: ProductDetailAPIResponse) => detail.price)),
                        rate: product.productDetails
                            .map((detail: ProductDetailAPIResponse) => {
                                let countRate: number = detail.orderItems.filter((orderItem: OrderItemAPIResponse) => orderItem.rate).length;
                                return detail.orderItems
                                    .map((orderItem: OrderItemAPIResponse) => orderItem.rate ? orderItem.rate.rate / countRate : 0)
                                    .reduce((a: number, b: number) => a + b, 0);
                            })
                            .reduce((a: number, b: number) => a + b, 0) / product.productDetails.length,
                        retailer: product.user.username,
                        rateCount: product.productDetails
                            .map((detail: ProductDetailAPIResponse) => detail.orderItems
                                .filter((orderItem: OrderItemAPIResponse) => orderItem.rate).length)
                            .reduce((a: number, b: number) => a + b, 0),
                        sales: product.productDetails
                            .map((detail: ProductDetailAPIResponse) => detail.orderItems.length)
                            .reduce((a: number, b: number) => a + b, 0),
                        createdDate: product.createdDate,
                    } as IProductCard;
                })
                setProductCards(productCards);
                setLoading(false);
            });
    }, []);

    const filterProducts = (key: string) => {
        const copy = [...productCards];

        switch (key) {
            case "nearby":

                break;
            case "promotion":

                break;
            case "bestnews":
                copy.sort((a: IProductCard, b: IProductCard) =>
                    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
                break;
            case "bestsellers":
                copy.sort((a: IProductCard, b: IProductCard) => b.sales - a.sales);
                break;
            case "toprates":
                copy.sort((a: IProductCard, b: IProductCard) => b.rate - a.rate);
                break;
            default:
                copy.sort((a: IProductCard, b: IProductCard) => a.index - b.index);
                break;
        }
        setProductCards(copy);
    };

    return (
        <div className="p-4 bg-white rounded-lg">
            <div>Top Deal - Siêu rẻ</div>
            <MenuMain filterProducts={filterProducts}/>
            <div
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {isLoading ? <ProductRowLoading count={8}/> : (
                    <>
                        {productCards.map((productCard: IProductCard) => (
                            <ProductCard key={productCard.id} product={productCard}/>
                        ))}
                    </>
                )}
            </div>
        </div>
    );

};

export default ProductRows;