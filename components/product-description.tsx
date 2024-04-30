import {Card} from "antd";
import React from "react";
import {NextPage} from "next";

const ProductDescription = ({shortDescription, description}: {shortDescription: string, description: string}) => {

    return (
        <>
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
        </>
    );

};

export default ProductDescription;