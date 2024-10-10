import React from "react";
import { Carousel } from "antd";

interface CarouselBannerProps {
  images: string[];
}

const CarouselBanner: React.FC<CarouselBannerProps> = ({ images }) => {
  return (
    <Carousel autoplay dotPosition="right">
      {images.map((image, index) => (
        <div key={index}>
          <img
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-[8px]"
            src={image}
            alt=""
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CarouselBanner;
