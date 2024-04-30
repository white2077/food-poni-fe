import {Card} from "antd";
import React from "react";
import {IRetailer} from "../pages/[pid]";
import {NextPage} from "next";

const ProductRetailer = ({retailer}: { retailer: IRetailer }) => {

    return (
        <Card>
            <div>Product retailer</div>
        </Card>
    );

};

export default ProductRetailer;