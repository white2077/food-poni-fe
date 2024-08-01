import React from "react";
import {SidebarLayout} from "./_layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import ProductCategory from "../components/product-category";
import SearchPosition from "../components/search-position";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {ProductCategoryAPIResponse} from "../models/product_category/ProductCategoryAPIResponse";
import {server} from "../utils/server";
import {getProductsPage} from "../queries/product.query";
import {getCategoriesPage} from "../queries/category.query";

export async function getServerSideProps() {
    return {
        props: {
            ePage: await getCategoriesPage({
                page: 0,
                pageSize: 100
            })
        }
    };
}

const Home = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<ProductCategoryAPIResponse[]> }) => {

    const sidebarContents: JSX.Element[] = [
        <ProductCategory key={0} categoryList={ePage.content}/>,
        <img key={1} className='rounded-md w-full'
             src={server + '/upload/vertical-banner.png'} alt={""}/>
    ]
    const MyCustomTitle = <div className="flex items-center">
        <img src="Sale.png" alt="Title" className="w-auto h-8 mr-2"/>
    </div>;
    return (
        <SidebarLayout sidebarContents={sidebarContents}>
            <div className='grid gap-4 h-fit'>
                <div className='overflow-auto relative'>
                    <CarouselBanner/>
                    <SearchPosition/>
                </div>

                <ProductRows
                    title={MyCustomTitle}
                    hasMenu={true}
                    query={getProductsPage({status: true})}
                />
                <ProductRows title="Món ngon - Giá sốc" hasMenu={false} query={getProductsPage({status: true})}/>
                <ProductRows title="Có thể bạn thấy ngon" hasMenu={true}
                             query={getProductsPage({status: true})}/>
            </div>
        </SidebarLayout>
    );

};

export default Home;
