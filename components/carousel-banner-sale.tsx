import React from "react";
import {Carousel} from 'antd';

const images: string[] = [
    'https://d3design.vn/uploads/%C3%A9dfjh30.jpg',
    'https://s.tmimgcdn.com/scr/800x500/301800/food-web-banner-social-media-cover-banner-food-advertising-discount-sale_301892-original.jpg',
    'https://s.tmimgcdn.com/scr/1200x750/301900/vector-food-web-banner-social-media-cover-banner-food-advertising-discount-sale-offer_301901-original.jpg',
    'https://cdn.dribbble.com/users/7038047/screenshots/15501942/restaurant-food-sale-social-media-banner-design.jpg'
];

const CarouselBannerSale = () => {
    return (
        <Carousel autoplay dotPosition='bottom'>
            {images.map((image, index) => (
                <div key={index}>
                    <img className="w-full h-[500px] object-cover flex items-center justify-items-center rounded-lg"
                         src={image}
                         alt=""
                    />
                </div>
            ))}
        </Carousel>
    );
};

export default CarouselBannerSale;