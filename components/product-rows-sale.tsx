import React, { useState } from 'react';
import ProductCard from "./product-card";
import { useSelector } from "react-redux";
import { RootState } from "../stores";
import { Page } from "../models/Page";
import { CurrentUser } from "../stores/user.reducer";
import MenuMain from "./menu-main";
import { Button } from "antd";
import ProductRowLoading from "./product-row-skeleton";
import Loading from './loading-product';

export interface IProductCard {
    index: number,
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    minPrice: number;
    maxPrice: number;
    rate: number;
    retailer: string;
    rateCount: number;
    sales: number;
    createdDate: Date;
}

interface ProductRowProps {
    hasMenu?: boolean,
    query: Promise<Page<IProductCard[]>>,
}

const ProductRowsSale = ({ hasMenu, query }: ProductRowProps) => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [productCards, setProductCards] = React.useState<IProductCard[]>([]);
    React.useEffect(() => {
        setLoading(true);
        query.then((res: Page<IProductCard[]>) => setProductCards(res.content))
            .finally(() => setLoading(false));
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

    const [showAll, setShowAll] = useState(false);
    const productsToShow = showAll ? productCards : productCards.slice(0, 8);

    return (
        <>
            <div className="p-2 sm:p-4 bg-white rounded-lg mb-3 sm:mb-5">
                {hasMenu && <MenuMain filterProducts={filterProducts} />}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 mt-2'>
                    {isLoading ? (
                        <div className="col-span-full flex justify-center">
                            <Loading loading={true}>
                                <div>Loading...</div>
                            </Loading>
                        </div>
                    ) : (
                        productsToShow.length !== 0 ? (
                            productsToShow.map((productCard) => (
                                <ProductCard key={productCard.id} product={productCard} />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">Không có dữ liệu!</div>
                        )
                    )}
                </div>
            </div>
            {productCards.length > 8 && (
                <div className="w-full flex justify-center mt-2 sm:mt-4">
                    <Button
                        className="!text-orange-500 text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Ẩn bớt' : 'Xem thêm'}
                    </Button>
                </div>
            )}
        </>
    );
}
export default ProductRowsSale;