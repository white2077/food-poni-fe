
const categories = [
  { name: "Đồ ăn vặt", image: "/hot-2.png" },
  { name: "Lẩu", image: "/hot-1.png" },
  { name: "Trà sữa", image: "/hot-3.png" },
  { name: "Đồ chay", image: "/hot-1.png" },
  { name: "Cơm", image: "/hot-1.png" },
  { name: "Phở", image: "/hot-1.png" },
];

const CategoryItem = ({ name, image }: { name: string; image: string }) => (
  <div className="flex flex-col items-center">
    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 cursor-pointer border-2 sm:border-4 border-orange-500 flex items-center justify-center rounded-full bg-orange-400 hover:bg-orange-500 transition-all duration-300">
      <img
        src={image}
        className="object-cover w-20 sm:w-24 md:w-32 hover:w-22 sm:hover:w-28 md:hover:w-36 transition-all duration-300"
        alt={name}
      />
    </div>
    <span className="mt-2 text-center nunito text-base sm:text-xl md:text-2xl">
      {name}
    </span>
  </div>
);

const BannerHotSale = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full my-3 sm:my-4 md:my-5">
      {categories.map((category, index) => (
        <CategoryItem key={index} {...category} />
      ))}
    </div>
  );
};

export default BannerHotSale;
