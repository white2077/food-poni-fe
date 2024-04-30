import {Card} from "antd";
import React from "react";
import {NextPage} from "next";

const ProductInfo = ({description}: { description: string }) => {

    return (
        <Card>
            <div>Mô tả sản phẩm</div>
            <div style={{color: 'black'}}
                 dangerouslySetInnerHTML={{__html: description || ''}}></div>
        </Card>
    );

};

export default ProductInfo;