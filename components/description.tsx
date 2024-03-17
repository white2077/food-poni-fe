import {Card, Rate} from "antd";
import React from "react";
import {IProduct} from "../pages/products/all-product";

const Description = ({product}: { product: IProduct }) => {

    return (
        <div style={{textAlign: 'left'}}>
            <Card size='small'>
                <div>{product?.name + (product?.productDetails?.[0]?.name ? ' - ' + product.productDetails[0].name : '')}</div>
                <Rate allowHalf defaultValue={4.5} style={{fontSize: '12px', marginRight: '8px'}}/>
                <span>Đã bán 500</span>
                <div>${product?.productDetails?.[0]?.price}</div>
            </Card>
            <Card size='small'>
                <div>Thông tin vận chuyển</div>
                <div>Giao đến Q. Hoàn Kiếm, P. Hàng Trống, Hà
                    Nội</div>
            </Card>
            <Card size='small'>
                <div>Mô tả sản phẩm</div>
                <div style={{color: 'black'}}
                     dangerouslySetInnerHTML={{__html: product.shortDescription || ''}}></div>
            </Card>
        </div>
    )
}

export default Description