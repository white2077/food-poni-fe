import {Card} from "antd";
import React from "react";

const ProductInfo = ({description}: { description: string }) => {

    return (
        <Card>
            <div>  Mô tả sản phẩm</div>
            <div className="text-black"
                 dangerouslySetInnerHTML={{__html: description || ''}}></div>
        </Card>
    );

};

export default ProductInfo;