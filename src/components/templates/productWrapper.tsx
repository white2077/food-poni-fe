import { useDispatch, useSelector } from "react-redux";
import { Params, useParams } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import { useEffect } from "react";
import ProductGallery from "@/components/product-gallery.tsx";
import { Card, Checkbox, Radio, Rate } from "antd";
import ReadMore from "@/components/atoms/readMore.tsx";
import { ProductLoading } from "@/components/atoms/productLoading.tsx";
import ProductCart from "@/components/organisms/productCart.tsx";
import ProductRate from "./productRateWrapper";
import {
  fetchProductAction,
  updateProductDetailSelectedSuccess,
  updateToppingsSelectedSuccess,
  updateTypeSelectedSuccess,
} from "@/redux/modules/product.ts";
import { currencyFormat } from "@/utils/common.ts";

export default function ProductWrapper() {
  const { pathVariable } = useParams<Params<string>>();
  const dispatch = useDispatch();
  const { product, productDetails } = useSelector(
    (state: RootState) => state.product.productSelected,
  );
  const { productDetail, toppingsSelected } = useSelector(
    (state: RootState) => state.product.itemsSelected,
  );

  useEffect(() => {
    if (pathVariable) {
      dispatch(fetchProductAction({ pathVariable }));
    }
  }, [pathVariable]);

  if (productDetails.length < 1) {
    return <ProductLoading />;
  }

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2fr_3fr_2fr] gap-4">
        <div className="lg:sticky top-5">
          <ProductGallery images={Array.from(new Set(productDetail.images))} />
        </div>
        <div className="grid gap-4 lg:order-1 order-2">
          <Card size="small">
            <h2 className="text-xl">
              {product.name + " - " + productDetail.name}
            </h2>
            <div className="my-2 flex flex-wrap items-center">
              <span className="border-r-2 py-1 pr-2 flex items-center">
                <span className="m-1 border-b-2 text-lg">
                  {(productDetail.rate ? productDetail.rate.toFixed(1) : 0) +
                    ""}
                </span>
                <Rate
                  allowHalf
                  disabled
                  value={productDetail.rate}
                  className="text-xs mr-[8px]"
                />
              </span>
              <span className="border-r-2 py-1 px-1 hidden md:inline">
                <span className="text-lg m-1 border-b-2">
                  {productDetail.rateCount}
                </span>{" "}
                Đánh giá
              </span>
              <span className="py-1 px-1">
                <span className="text-lg m-1 border-b-2">
                  {productDetail.sales}
                </span>
                Lượt bán
              </span>
            </div>
            <h3 className="text-2xl font-semibold">
              {currencyFormat(productDetail.price)}
            </h3>
          </Card>
          {productDetails.length > 1 && (
            <Card size="small" title="Loại sản phẩm" className="static">
              <Radio.Group defaultValue={productDetails[0].name || "default"}>
                {(productDetails || []).map((productDetail) => (
                  <Radio.Button
                    key={productDetail.id}
                    value={productDetail.name || "default"}
                    onClick={() =>
                      dispatch(
                        updateProductDetailSelectedSuccess({ productDetail }),
                      )
                    }
                    className="!rounded-lg m-2 static hover:static border-[1px]"
                  >
                    {productDetail.name || "Default"}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Card>
          )}
          {product.toppings.length > 0 && (
            <Card size="small" title="Các loại topping" className="static">
              {product.toppings.map((it, index) => (
                <Checkbox
                  key={index}
                  checked={toppingsSelected.includes(it)}
                  onClick={() =>
                    dispatch(updateToppingsSelectedSuccess({ topping: it }))
                  }
                >{`${it.name}: ${currencyFormat(it.price)}`}</Checkbox>
              ))}
            </Card>
          )}
          {product.types.length > 0 && (
            <Card size="small" title="Loại" className="static">
              <Radio.Group
                onChange={(e) =>
                  dispatch(updateTypeSelectedSuccess({ type: e.target.value }))
                }
                defaultValue={product.types[0]}
                options={product.types}
              />
            </Card>
          )}
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
          <ReadMore content={productDetail.description} />
        </div>
        <div className="lg:sticky top-5 lg:order-2 order-1">
          <ProductCart />
        </div>
      </div>
      <ProductRate productDetail={productDetail} />
    </div>
  );
}
