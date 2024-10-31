import BannerHotSale from "../components/banner-hot-sale";
import CarouselBanner from "../components/carousel-banner";
import { DefaultLayout } from "./templates/DefaultLayout";

const RedMoreRow = () => {
  const bannerImages = [
    "https://d3design.vn/uploads/%C3%A9dfjh30.jpg",
    "https://s.tmimgcdn.com/scr/800x500/301800/food-web-banner-social-media-cover-banner-food-advertising-discount-sale_301892-original.jpg",
    "https://s.tmimgcdn.com/scr/1200x750/301900/vector-food-web-banner-social-media-cover-banner-food-advertising-discount-sale-offer_301901-original.jpg",
    "https://cdn.dribbble.com/users/7038047/screenshots/15501942/restaurant-food-sale-social-media-banner-design.jpg",
  ];

  return (
    <DefaultLayout>
      <CarouselBanner images={bannerImages} />
      <BannerHotSale />
      {/* <ProductRowsSale
        hasMenu={false}
        query={getProductsCardPage({ status: true })}
      /> */}
      <div className="w-full my-5 rounded-lg">
        <img
          src="/banner-hot-pizza.png"
          alt="Hot Pizza Banner"
          className="w-full object-cover rounded-lg"
        />
      </div>
      {/* <ProductRowsSale
        hasMenu={false}
        query={getProductsCardPage({ status: true })}
      /> */}
    </DefaultLayout>
  );
};

export default RedMoreRow;
