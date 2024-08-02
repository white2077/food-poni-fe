import React from 'react';
import ProductCard from "./product-card";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {CurrentUser} from "../stores/user.reducer";
import MenuMain from "./menu-main";
import {ProductAPIResponse} from "../models/product/ProductAPIResponse";
import ProductRowLoading from "./product-row-skeleton";
import {Carousel} from "antd";
import {
    ArrowLeftOutlined,
    ArrowRightOutlined, LeftCircleOutlined,
    LeftOutlined,
    RightCircleOutlined,
    RightOutlined
} from "@ant-design/icons";
import {CustomArrowProps} from "@ant-design/react-slick";
import ProductCardRelated from "./related-products-card";
import {className} from "postcss-selector-parser";

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
    title: string | JSX.Element,
    query: Promise<Page<ProductAPIResponse[]>>,
}

const RelatedProducts = ({title,query}: ProductRowProps) => {
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

    const productGroups = [];
    for (let i = 0; i < productCards.length; i += 6) {
        productGroups.push(productCards.slice(i, i + 6));
    }
    const CustomPrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
        return (
            <div onClick={onClick}
                 className="custom-arrow next-arrow mx-2 absolute top-[47%] left-0 text-orange-400 text-xl w-8 h-8 hover:text-orange-500 cursor-pointer shadow-lg shadow-gray-400 bg-white z-50 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M12.0899 14.5899C11.7645 14.9153 11.2368 14.9153 10.9114 14.5899L5.91139 9.58991C5.58596 9.26447 5.58596 8.73683 5.91139 8.4114L10.9114 3.41139C11.2368 3.08596 11.7645 3.08596 12.0899 3.41139C12.4153 3.73683 12.4153 4.26447 12.0899 4.58991L7.67916 9.00065L12.0899 13.4114C12.4153 13.7368 12.4153 14.2645 12.0899 14.5899Z"
                          fill="#f36f24"></path>
                </svg>
            </div>
        );
    };

    const CustomNextArrow: React.FC<CustomArrowProps> = ({onClick}) => {
        return (
            <div onClick={onClick}
                 className="custom-arrow next-arrow mx-2 absolute top-[47%] right-0 text-orange-400 text-xl w-8 h-8 hover:text-orange-500 cursor-pointer shadow-lg shadow-gray-400 bg-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd"
                          d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z"
                          fill="#f36f24"></path>
                </svg>
            </div>
        );
    };

    return (
        <div className="p-4 bg-white rounded-lg">

            <div className="mt-2">{title}</div>
            <div style={{maxWidth: '30rem', margin: 'auto'}}>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <Carousel
                        onLazyLoad={() => console.log('lazy load')}
                        arrows
                        prevArrow={<CustomPrevArrow/>}
                        nextArrow={<CustomNextArrow/>}
                        infinite={true}
                        dots={false}
                    >
                        {productGroups.map((group, index) => (
                            <div key={index}>
                                <div
                                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 pb-2 mt-2'>
                                    {group.map((productCard: IProductCard) => (
                                        <ProductCardRelated key={productCard.id} product={productCard}/>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Carousel>
                )}
            </div>
        </div>
    );
}
export default RelatedProducts;