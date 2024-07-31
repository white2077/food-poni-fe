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
    for (let i = 0; i < productCards.length; i += 4) {
        productGroups.push(productCards.slice(i, i + 4));
    }
    const CustomPrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
        return (
            <div onClick={onClick} className="custom-arrow next-arrow mx-2 absolute top-52 left-0 text-orange-400 text-xl w-8 h-8 hover:text-orange-500 cursor-pointer shadow-lg shadow-gray-400 bg-white z-50 rounded-full flex items-center justify-center">
                <LeftOutlined />
            </div>
        );
    };

    const CustomNextArrow: React.FC<CustomArrowProps> = ({ onClick }) => {
        return (
            <div onClick={onClick} className="custom-arrow next-arrow mx-2 absolute top-52 right-0 text-orange-400 text-xl w-8 h-8 hover:text-orange-500 cursor-pointer shadow-lg shadow-gray-400 bg-white rounded-full flex items-center justify-center">
                <RightOutlined />
            </div>
        );
    };

    return (
        <div className="p-4 bg-white rounded-lg">
            {hasMenu && <MenuMain filterProducts={filterProducts} />}
            <div className="mt-2">{title}</div>
            <div style={{ maxWidth: '59rem', margin: 'auto' }}>
                <Carousel
                    arrows
                    prevArrow={<CustomPrevArrow />}
                    nextArrow={<CustomNextArrow />}
                    infinite={true}
                    dots={false}
                >
                    {productGroups.map((group, index) => (
                        <div key={index}>
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-2 mt-2'>
                                {group.map((productCard: IProductCard) => (
                                    <ProductCard key={productCard.id} product={productCard}/>
                                ))}
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
}
export default ProductRows;