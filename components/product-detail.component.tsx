import {IProduct} from "../pages/products/all-product";
import {IProductDetail} from "../pages/products/[id]";
import React, {useState} from "react";
import {Card, Col, Radio, Rate, Row} from "antd";
import ImageProductDetail from "./image-product-detail.";
import AddToCard from "./add-to-card";

const ProductDetailComponent = ({product, firstProductDetail}: {
    product: IProduct | null,
    firstProductDetail: IProductDetail | null
}) => {

    const [productDetailSelected, setProductDetailSelected] = useState<IProductDetail>();

    const changeProductDetailSelected = (productDetail: IProductDetail) => {
        setProductDetailSelected(productDetail);
    }

    const {images, name: productDetailName, price, description} = productDetailSelected || firstProductDetail || {};
    const {name: productName, shortDescription} = product || {};

    return (
        <>
            {(firstProductDetail && product) && (
                <Row gutter={[16, 16]}>
                    <Col flex={3}>
                        <ImageProductDetail images={images}/>
                    </Col>
                    <Col flex={4}>
                        <div style={{textAlign: 'left'}}>
                            <Card>
                                <div>
                                    {productName + (productDetailName ? ' - ' + productDetailName : "")}
                                </div>
                                <Rate allowHalf defaultValue={4.5} style={{fontSize: '12px', marginRight: '8px'}}/>
                                <span>Đã bán 500</span>
                                <div>${price}</div>
                                {(product && product.productDetails && product.productDetails.length > 1) && (
                                    <>
                                        <div>Loại</div>
                                        <Radio.Group defaultValue={productDetailName || "default"}>
                                            {(product?.productDetails || []).map((productDetail) => (
                                                <Radio.Button key={productDetail.id}
                                                              value={productDetail.name || "default"}
                                                              onClick={() => changeProductDetailSelected(productDetail)}>
                                                    {productDetail.name || "Default"}
                                                </Radio.Button>
                                            ))}
                                        </Radio.Group>
                                    </>
                                )}
                            </Card>
                            <Card>
                                <div>Thông tin vận chuyển</div>
                                <div>Giao đến Q. Hoàn Kiếm, P. Hàng Trống, Hà Nội</div>
                            </Card>
                            <Card>
                                <div>Mô tả ngắn</div>
                                <div style={{color: 'black'}}
                                     dangerouslySetInnerHTML={{__html: shortDescription || ''}}></div>
                            </Card>
                            <Card>
                                <div>Mô tả sản phẩm</div>
                                <div style={{color: 'black'}}
                                     dangerouslySetInnerHTML={{__html: description || ''}}></div>
                            </Card>
                        </div>
                    </Col>
                    <Col flex={3}>
                        <AddToCard price={price}/>
                    </Col>
                </Row>
            )}
        </>
    );
}

export default ProductDetailComponent