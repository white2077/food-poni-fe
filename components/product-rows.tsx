import React from 'react';
import ProductCard from "./product-card";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {CurrentUser} from "../stores/user.reducer";
import MenuMain from "./menu-main";
import {ProductAPIResponse} from "../models/product/ProductAPIResponse";
import {ProductDetailAPIResponse} from "../models/product_detail/ProductDetailAPIResponse";
import {OrderItemAPIResponse} from "../models/order_item/OrderItemResponseAPI";
import ProductRowLoading from "./product-row-skeleton";
import {AxiosResponse} from "axios";

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

interface ProductRowProps {
    title: string,
    hasMenu?: boolean,
    query: Promise<Page<ProductAPIResponse[]>>,
}

const ProductRows = ({title, hasMenu, query}: ProductRowProps) => {

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
                    rateCount: 0,
                    sales: product.sales,
                    createdDate: product.createdDate,
                } as IProductCard
            }));
        }).finally(() =>  setLoading(false));

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
            <div>{title}</div>

            {hasMenu && < MenuMain filterProducts={filterProducts}/>}
            <div
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
                {isLoading ? <ProductRowLoading
                    count={8}/> : (productCards.length !== 0 ? productCards.map((productCard: IProductCard) =>
                    <ProductCard key={productCard.id} product={productCard}/>) : "Không có dữ liệu!")}

            </div>
        </div>
    );
};

export default ProductRows;