import React, { ReactNode } from "react";
import { SidebarLayout } from "./_layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import ProductCategory from "../components/product-category";
import SearchPosition from "../components/search-position";
import { Page } from "../models/Page";
import { ProductCategoryAPIResponse } from "../models/product_category/ProductCategoryAPIResponse";
import { server } from "../utils/server";
import { getProductsCardPage } from "../queries/product.query";
import { getCategoriesPage } from "../queries/product_category.query";

export async function getServerSideProps() {
    try {
        const ePage: Page<ProductCategoryAPIResponse[]> = await getCategoriesPage({
            page: 0,
            pageSize: 100
        });
        return { props: { ePage } };
    } catch (e) {
        throw e;
    }
}

interface HomePageProps {
    ePage: Page<ProductCategoryAPIResponse[]>
}

export default function HomePage({ ePage }: HomePageProps) {
    const sidebarContents: ReactNode[] = [
        <ProductCategory key={0} categoryList={ePage.content} />,
        <img key={1} className='rounded-md w-full'
            src={server + '/upload/vertical-banner.png'} alt={""} />
    ]
    const MyCustomTitle: ReactNode = <div className="flex items-center">
        <img src="/sale.png" alt="Title" className="w-auto h-8" />
    </div>;
    return (
        <SidebarLayout sidebarContents={sidebarContents}>
            <div className='grid gap-4 h-fit'>
                <div className='overflow-auto relative'>
                    <CarouselBanner images={[
                        'https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg',
                        'https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50',
                        'https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg',
                        'https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50'
                    ]} />
                    <SearchPosition />
                </div>
                <ProductRows
                    hasBorder={true}
                    hasMenu={true}
                    query={getProductsCardPage({ page: 0, pageSize: 10, status: true, sort: ["sales,desc"] })}
                />
                <ProductRows
                    hasBorder={false}
                    title={MyCustomTitle}
                    hasMenu={false}
                    query={getProductsCardPage({ page: 0, pageSize: 10, status: true })}
                    legacyBehavior={true}
                />
                <ProductRows
                    hasBorder={false}
                    title="Món ngon - Giá sốc"
                    hasMenu={false}
                    query={getProductsCardPage({ page: 0, pageSize: 10, status: true })}
                />
                <ProductRows
                    hasBorder={false}
                    title="Có thể bạn thấy ngon"
                    hasMenu={false}
                    query={getProductsCardPage({ page: 0, pageSize: 20, status: false })}
                />
            </div>
        </SidebarLayout>
    );
};