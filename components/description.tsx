import {Card, Col, Radio, RadioChangeEvent, Rate, Row} from "antd";
import React, {useEffect, useState} from "react";
import {IProduct} from "../pages/products/all-product";
import {IProductDetail} from "../pages/products/[id]";
import ImageProductDetail from "./image-product-detail.";
import AddToCard from "./add-to-card";

const Description = ({product}: { product: IProduct }) => {
    const firstProductDetail = product.productDetails?.[0];
    const [productDetailSelected, setProductDetailSelected] = useState<IProductDetail>();

    const onChange = (e: RadioChangeEvent) => {
    };

    return (
        <Row gutter={[16, 16]}>
            <Col flex={3}>
                <ImageProductDetail
                    images={productDetailSelected?.images ? productDetailSelected.images : firstProductDetail?.images}></ImageProductDetail>
            </Col>
            <Col flex={4}>
                <div style={{textAlign: 'left'}}>
                    <Card size='small'>
                        <div>
                            {product?.name +
                                (productDetailSelected?.name
                                    ? ' - ' + productDetailSelected.name
                                    : (firstProductDetail?.name ? ' - ' + firstProductDetail.name : ""))}
                        </div>
                        <Rate allowHalf defaultValue={4.5} style={{fontSize: '12px', marginRight: '8px'}}/>
                        <span>Đã bán 500</span>
                        <div>${productDetailSelected?.price ? productDetailSelected?.price : firstProductDetail?.price}</div>
                        <div>Loại</div>
                        <Radio.Group onChange={onChange}
                                     defaultValue={productDetailSelected?.name ? firstProductDetail?.name : "default"}>
                            {(product.productDetails || []).map((productDetail) => (
                                <Radio.Button key={productDetail.id}
                                              value={productDetail.name ? productDetail.name : "default"}
                                              onClick={() => setProductDetailSelected(productDetail)}
                                >
                                    {productDetail.name || "Default"}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Card>
                    <Card size='small'>
                        <div>Thông tin vận chuyển</div>
                        <div>Giao đến Q. Hoàn Kiếm, P. Hàng Trống, Hà
                            Nội
                        </div>
                    </Card>
                    <Card size='small'>
                        <div>Mô tả sản phẩm</div>
                        <div style={{color: 'black'}}
                             dangerouslySetInnerHTML={{__html: productDetailSelected?.description ? productDetailSelected?.description : (product.shortDescription || '')}}></div>
                    </Card>
                </div>
            </Col>
            <Col flex={3}>
                <AddToCard
                    price={productDetailSelected?.price ? productDetailSelected.price : firstProductDetail?.price}></AddToCard>
            </Col>
        </Row>
    )
}

export default Description