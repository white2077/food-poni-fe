import {DefaultLayout} from "../_layout";
import MenuShop from "../../components/menu-shop";
import React, {useEffect} from "react";
import {EnvironmentOutlined, MailOutlined, ShopOutlined, StarOutlined} from "@ant-design/icons";
import {ParsedUrlQuery} from "querystring";
import {ProductAPIResponse} from "../../models/product/ProductAPIResponse";
import {Page} from "../../models/Page";
import {UserAPIResponse} from "../../models/user/UserAPIResponse";
import {server} from "../../utils/server";
import ProductRowLoading from "../../components/product-row-skeleton";
import ProductCard from "../../components/product-card";
import {NextRouter, useRouter} from "next/router";
import {CustomArrowProps} from "@ant-design/react-slick";
import {Button, Carousel, Result} from "antd";
import Loading from "../../components/loading-product";
import {getUserById} from "../../queries/user.query";
import {getProductsCardPage, getProductsCardPageByRetailer} from "../../queries/product.query";

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

export async function getServerSideProps(context: {params: ParsedUrlQuery}) {
    const {sid} = context.params;

    if (typeof sid !== 'string') {
        throw new Error('invalid sid');
    }

    try {
        const data: UserAPIResponse = await getUserById(sid);
        return {props: {user: data}}
    } catch (e) {
        throw e;
    }
}

interface ShopPageProps {
    user: UserAPIResponse
}

const ShopDetail = ({user}: ShopPageProps) => {

    const router: NextRouter = useRouter();

    const [isLoading, setLoading] = React.useState<boolean>(false);

    const [productCards, setProductCards] = React.useState<IProductCard[]>([]);

    useEffect(() => {
        setLoading(true);
        getProductsCardPageByRetailer(user.id, {page: 0, pageSize: 10, status: true})
            .then(res => setProductCards(res.content))
            .finally(() => setLoading(false));
    }, [user]);

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
    for (let i = 0; i < productCards.length; i += 12) {
        productGroups.push(productCards.slice(i, i + 12));
    }
    const CustomPrevArrow: React.FC<CustomArrowProps> = ({onClick}) => {
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

        <DefaultLayout>
            {
                user.id ? (
                    <main className="grow content pt-5" id="content" role="content">
                        <div className="container-fixed" id="content_container"></div>
                        <div className="bg-center bg-cover bg-no-repeat hero-bg"
                             style={{backgroundImage: 'url(/bg-01.png)'}}>
                            <div className="container-fixed">
                                <div
                                    className="flex flex-col items-center gap-2 lg:gap-3.5 py-4 lg:pt-5 lg:pb-10">
                                    <img
                                        className="rounded-full border-3 border-4 border-orange-400 h-32 w-32 shrink-0 object-cover"
                                        src={server + user.avatar}/>
                                    <div className="flex items-center gap-1.5">
                                        <div className="text-lg leading-5 font-semibold text-gray-900">
                                            {user.username}
                                        </div>
                                        <svg className="text-primary" fill="none" height="16"
                                             viewBox="0 0 15 16"
                                             width="15"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                fill="currentColor">
                                            </path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-1 gap-5 text-sm">
                                        <div className="flex gap-2 items-center">
                                            <ShopOutlined/>
                                            <span className="text-gray-600">Sản phẩm: <span
                                                className="text-orange-500">300</span></span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <EnvironmentOutlined/>
                                            <span className="text-gray-600">{user.address.address}</span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <MailOutlined/>
                                            <a className="text-gray-600 hover:text-primary"
                                               href="mailto: jenny@kteam.com">
                                                {user.email}
                                            </a>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <StarOutlined/>
                                            <a className="text-gray-600 hover:text-primary"
                                               href="mailto: jenny@kteam.com">
                                                4.9
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white px-4 pb-4 rounded-lg">
                            <MenuShop filterProducts={filterProducts}></MenuShop>
                            <div>
                                <div className="py-4 w-48">
                                    <img src={"/sale.png"}/>
                                </div>
                                <div
                                    className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 bg-white'>
                                    {isLoading ? <ProductRowLoading
                                        count={8}/> : (productCards.length !== 0 ? productCards.map((productCard: IProductCard) =>
                                        <ProductCard key={productCard.id}
                                                     product={productCard}/>) : "Không có dữ liệu!")}
                                </div>
                            </div>
                            {isLoading ? (
                                <Loading/>
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
                                                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pb-2 mt-2'>
                                                {group.map((productCard: IProductCard) => (
                                                    <ProductCard key={productCard.id} product={productCard}/>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </Carousel>
                            )}
                        </div>
                    </main>
                ) : (
                    <Result
                        status="404"
                        title="404"
                        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại"
                        extra={<Button type="primary" onClick={() => router.push('/')}>Tiếp tục mua sắm</Button>}/>
                )
            }
        </DefaultLayout>
    );
};


export default ShopDetail;