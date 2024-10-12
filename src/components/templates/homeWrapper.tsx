import CarouselBanner from "@/components/carousel-banner.tsx";
import SearchPosition from "@/components/searchPosition.tsx";
import { fetchProductsByCustomerRequest } from "@/redux/modules/product.ts";
import { ProductRows } from "@/components/organisms/productRows.tsx";
import { ProductRowsFilter } from "@/components/organisms/productRowsFilter.tsx";

export default function HomeWrapper() {
  return (
    <div className="grid gap-4 h-fit">
      <div className="overflow-auto relative">
        <CarouselBanner
          images={[
            "https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg",
            "https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50",
            "https://cdn.magicdecor.in/com/2023/09/29153817/Fast-Food-Banner-Background-for-Wall-1.jpg",
            "https://ik.imagekit.io/awwybhhmo/satellite_images/chinese/beyondmenu/hero/7.jpg?tr=w-3840,q-50",
          ]}
        />
        {/*<SearchPosition />*/}
      </div>
      <ProductRowsFilter
        action={fetchProductsByCustomerRequest({
          requestParams: {
            page: 0,
            pageSize: 10,
            sort: "updatedDate,desc",
            status: true,
          },
        })}
      />
      <ProductRows
        hasBorder={false}
        title={
          <div className="flex items-center">
            <img src="/sale.png" alt="Title" className="w-auto h-8" />
          </div>
        }
        action={fetchProductsByCustomerRequest({
          requestParams: { page: 0, pageSize: 10, status: true },
        })}
        legacyBehavior={true}
      />
      <ProductRows
        hasBorder={false}
        title="Món ngon - Giá sốc"
        action={fetchProductsByCustomerRequest({
          requestParams: { page: 0, pageSize: 10, status: false },
        })}
      />
      <ProductRows
        hasBorder={false}
        title="Có thể bạn thấy ngon"
        action={fetchProductsByCustomerRequest({
          requestParams: { page: 0, pageSize: 10, status: false },
        })}
      />
    </div>
  );
}
