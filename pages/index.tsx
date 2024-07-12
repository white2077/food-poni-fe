import React, {useState} from "react";
import {SidebarLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import ProductCategory from "../components/product-category";
import SearchPosition from "../components/search-position";
import {api} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {CategoryAPIResponse} from "../models/category/CategoryAPIResponse";
import {server} from "../utils/server";
import {getProductsPage} from "../queries/product.query";

export async function getServerSideProps() {
    try {
        const res: AxiosResponse<Page<CategoryAPIResponse[]>> = await api.get("/product-categories?onlyParent=true");
        return {
            props: {
                ePage: res.data
            },
        };
    } catch (error) {
        console.error('Error fetching category page:', error);
    }
}

const Home = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<CategoryAPIResponse[]> }) => {

    const sidebarContents: JSX.Element[] = [
        <ProductCategory key={0} categoryList={ePage.content}/>,
        <img key={1} className='rounded-md w-full'
             src={server + '/upload/vertical-banner.png'}/>
        // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-GyDWnLZ77IVqwCBJYj3KSEafcAMiGAfJlj1kqG0U_Q&s
    ]

    return (
        <SidebarLayout sidebarContents={sidebarContents}>
            <div className='grid gap-4 h-fit'>
                <div className='overflow-auto relative'>
                    <CarouselBanner/>
                    <SearchPosition/>
                </div>
                <ProductRows title="Top Deal - Siêu rẻ" hasMenu={true} query={getProductsPage({status: true})}/>
                <ProductRows title="Món ngon - Giá sốc" hasMenu={false}
                             query={Promise.resolve(INITIAL_PAGE_API_RESPONSE)}/>
                <ProductRows title="Có thể bạn thấy ngon" hasMenu={false}
                             query={Promise.resolve(INITIAL_PAGE_API_RESPONSE)}/>
            </div>
        </SidebarLayout>
    );

};

export default Home;
