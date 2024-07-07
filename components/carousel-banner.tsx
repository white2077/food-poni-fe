import React from "react";
import {Carousel} from 'antd';

const images: string[] = [
    'https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg',
    'https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50',
    'https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg',
    'https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50'
];

const CarouselBanner = () => {
    return (
        <Carousel autoplay dotPosition='right'>
            {images.map((image, index) => (
                <div key={index}>
                    <img style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                        src={image}
                        alt=""
                    />
                </div>
            ))}
        </Carousel>
    );
};

export default CarouselBanner;