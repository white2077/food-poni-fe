import {ReactNode} from "react";
import ProductCategory from "@/components/product-category.tsx";
import {server} from "@/utils/server.ts";
import CarouselBanner from "@/components/carousel-banner.tsx";
import SearchPosition from "@/components/searchPosition.tsx";
import {SidebarLayout} from "@/app/pages/_layout.tsx";
import {fetchProductsByCustomerRequest} from "@/redux/modules/product.ts";
import {ProductRows} from "@/components/organisms/productRows.tsx";
import {ProductRowsFilter} from "@/components/organisms/productRowsFilter.tsx";

const sidebarContents: ReactNode[] = [
    <ProductCategory key={0} categoryList={[]}/>,
    <img key={1} className='rounded-md w-full'
         src={server + '/upload/vertical-banner.png'} alt={""}/>
];

export default function HomeWrapper() {

    return (
        <SidebarLayout sidebarContents={sidebarContents}>
            <div className='grid gap-4 h-fit'>
                <div className='overflow-auto relative'>
                    <CarouselBanner images={[
                        'https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg',
                        'https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50',
                        'https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg',
                        'https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50'
                    ]}/>
                    <SearchPosition/>
                </div>
                <ProductRowsFilter
                    action={fetchProductsByCustomerRequest("updatedDate,desc")}
                />
                <ProductRows
                    hasBorder={false}
                    title={
                        <div className="flex items-center">
                            <img src="/sale.png" alt="Title" className="w-auto h-8"/>
                        </div>
                    }
                    action={fetchProductsByCustomerRequest()}
                    legacyBehavior={true}
                />
                <ProductRows
                    hasBorder={false}
                    title="Món ngon - Giá sốc"
                    action={fetchProductsByCustomerRequest()}
                />
                <ProductRows
                    hasBorder={false}
                    title="Có thể bạn thấy ngon"
                    action={fetchProductsByCustomerRequest()}
                />
            </div>
        </SidebarLayout>
    );
}