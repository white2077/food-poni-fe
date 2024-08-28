// Tạo một React component trong file LabelContainer.js trong dự án Next.js của bạn
import React from 'react';
import {DefaultLayout} from "./_layout";
import ProductRows from "../components/product-rows";
import {getProductsCardPage} from "../queries/product.query";
import CarouselBannerHotSale from "../components/carousel-banner-sale";
import ProductRowsSale from "../components/product-rows-sale";
import BannerHotSale from "../components/banner-hot-sale";

const RedMoreRow = () => {

    return (
        <DefaultLayout>
            <CarouselBannerHotSale/>
            <BannerHotSale/>
            <ProductRowsSale hasMenu={false} query={getProductsCardPage({status: true})}/>
            <div className="w-full my-5 rounded-lg">
                <img src="/banner-hot-pizza.png" className="w-full object-cover rounded-lg"/>
            </div>
            <ProductRowsSale hasMenu={false} query={getProductsCardPage({status: true})}/>
        </DefaultLayout>
    );
};

export default RedMoreRow;