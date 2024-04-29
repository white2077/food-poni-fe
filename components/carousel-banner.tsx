import React from "react";
import {Carousel} from 'antd';

const CarouselBanner = () => {

    return (
        <div className='overflow-hidden'>
            <Carousel autoplay>
                <div>
                    <img style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px'}}
                         src='https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg'
                         alt=''/>
                </div>
                <div>
                    <img style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px'}}
                         src='https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50'
                         alt=''/>
                </div>
                <div>
                    <img style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px'}}
                         src='https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg'
                         alt=''/>
                </div>
                <div>
                    <img style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px'}}
                         src='https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50'
                         alt=''/>
                </div>
            </Carousel>
        </div>

    );

};

export default CarouselBanner;