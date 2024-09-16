import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {CurrentUser} from "../stores/user.reducer";
import {ProductAPIResponse} from "../models/product/ProductAPIResponse";
import {Button} from "antd";
import MenuMain from "../components/menu-main";
import ProductRowLoading from "../components/product-row-skeleton";
import ProductCard from "../components/product-card";

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
    query: Promise<Page<ProductAPIResponse[]>>,
}

const ProductRowsSale = ({hasMenu, query}: ProductRowProps) => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);
    const [isLoading, setLoading] = React.useState<boolean>(false);
    const [productCards, setProductCards] = React.useState<IProductCard[]>([]);
    React.useEffect(() => {
        setLoading(true);
        query.then((res: Page<ProductAPIResponse[]>) => {
            setProductCards(res.content.map((product: ProductAPIResponse, index: number) => {
                return {
                    index,
                    id: product.id,
                    name: product.name,
                    thumbnail: product.thumbnail,
                    minPrice: product.minPrice,
                    maxPrice: product.maxPrice,
                    rate: product.rate,
                    retailer: product.user.username,
                    rateCount: product.rateCount,
                    sales: product.sales,
                    createdDate: product.createdDate,
                } as IProductCard
            }));
        }).finally(() => setLoading(false));
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
            <div className="p-4 bg-white rounded-lg mb-5">
                {hasMenu && <MenuMain filterProducts={filterProducts}/>}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2'>
                    {isLoading ? (
                        <ProductRowLoading count={8}/>
                    ) : (
                        productsToShow.length !== 0 ? (
                            productsToShow.map((productCard) => (
                                <ProductCard key={productCard.id} product={productCard}/>
                            ))
                        ) : (
                            "Không có dữ liệu!"
                        )
                    )}
                </div>
            </div>
            <div className="w-full flex justify-center">
                <Button className="!text-orange-500" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Ẩn bớt' : 'Xem thêm'}
                </Button>
            </div>
        </>
    );
}
export default ProductRowsSale;