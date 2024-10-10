import { useDispatch, useSelector } from "react-redux";
import { Params, useParams } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import { useEffect } from "react";
import {
  fetchProductAction,
  updateProductDetailSelected,
} from "@/redux/modules/product.ts";
import ProductGallery from "@/components/product-gallery.tsx";
import { Card, Radio, Rate } from "antd";
import Tym from "@/components/atoms/tym.tsx";
import ReadMore from "@/components/atoms/readMore.tsx";
import { ProductLoading } from "@/components/atoms/productLoading.tsx";
import ProductCart from "@/components/organisms/productCart.tsx";
import { server } from "@/utils/server.ts";
import ProductRate from "./productRateWrapper";

export default function ProductWrapper() {
  const { pathVariable } = useParams<Params<string>>();
  const dispatch = useDispatch();
  const { product, productDetails } = useSelector(
    (state: RootState) => state.product.productSelected,
  );
  const { productDetailSelected } = useSelector(
    (state: RootState) => state.product,
  );

  useEffect(() => {
    if (pathVariable) {
      dispatch(fetchProductAction(pathVariable));
    }
  }, [pathVariable]);

  if (
    !product ||
    !productDetails ||
    productDetails.length < 1 ||
    !productDetailSelected
  ) {
    return <ProductLoading />;
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_3fr_2fr] gap-4">
        <div className="lg:sticky top-5">
          <ProductGallery
            images={Array.from(new Set(productDetailSelected.images))}
          />
        </div>
        <div className="grid gap-4 lg:order-1 order-2">
          <Card size="small">
            <h2 className="text-xl">
              {product.name + " - " + productDetailSelected.name}
            </h2>
            <div className="my-2 flex flex-wrap items-center">
              <span className="border-r-2 py-1 pr-2 flex items-center">
                <span className="m-1 border-b-2 text-lg">
                  {(productDetailSelected.rate
                    ? productDetailSelected.rate.toFixed(1)
                    : 0) + ""}
                </span>
                <Rate
                  allowHalf
                  disabled
                  value={productDetailSelected.rate}
                  className="text-xs mr-[8px]"
                />
              </span>
              <span className="border-r-2 py-1 px-1 hidden md:inline">
                <span className="text-lg m-1 border-b-2">
                  {productDetailSelected.rateCount}
                </span>{" "}
                Đánh giá
              </span>
              <span className="border-r-2 py-1 px-1">
                <span className="text-lg m-1 border-b-2">
                  {productDetailSelected.sales}
                </span>{" "}
                Lượt bán
              </span>
              <span className="flex items-center px-1">
                <Tym /> <span className=" ml-1">9999 Lượt thích</span>
              </span>
            </div>
            <h3 className="text-2xl font-semibold">
              {productDetailSelected.price}
              <sup>₫</sup>
            </h3>
          </Card>
          <Card
            hidden={productDetails.length == 1}
            size="small"
            title="Loại sản phẩm"
            className="static"
          >
            {productDetails && productDetails.length > 1 && (
              <Radio.Group defaultValue={productDetails[0].name || "default"}>
                {(productDetails || []).map((productDetail) => (
                  <Radio.Button
                    key={productDetail.id}
                    value={productDetail.name || "default"}
                    onClick={() =>
                      dispatch(updateProductDetailSelected(productDetail))
                    }
                    className="!rounded-lg m-2 static hover:static border-[1px]"
                  >
                    {productDetail.name || "Default"}
                  </Radio.Button>
                ))}
              </Radio.Group>
            )}
          </Card>
          {/*<Card size='small' title='Thông tin vận chuyển' hidden={currentShippingAddress.id === ""}>*/}
          {/*    <ProductLoading loading={Object.keys(currentShippingAddress).length === 0}>*/}
          {/*        {currentShippingAddress.address}*/}
          {/*    </ProductLoading>*/}
          {/*</Card>*/}
          <Card size="small" title="Mô tả ngắn">
            <div
              className="text-black"
              dangerouslySetInnerHTML={{
                __html: product.shortDescription || "",
              }}
            ></div>
          </Card>
          {/*<RelatedProducts title="Sản phẩm liên quan"*/}
          {/*                 query={getProductsCardPage({page: 0, pageSize: 20, status: true})}/>*/}
          <ReadMore content={productDetailSelected.description} />
        </div>
        <div className="lg:sticky top-5 lg:order-2 order-1">
          <ProductCart
            id={productDetailSelected.id}
            price={productDetailSelected.price}
            thumbnail={
              productDetailSelected.images &&
              productDetailSelected.images.length > 0
                ? server + productDetailSelected.images[0]
                : ""
            }
            productName={product.name}
            productDetailName={productDetailSelected.name}
            status={productDetailSelected.status}
          />
        </div>
      </div>
      <ProductRate item={productDetailSelected} />
    </div>
  );
}
