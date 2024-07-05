import {Badge, Card, Divider, notification, Rate, Skeleton, Space} from "antd";
import React, {useEffect, useState} from "react";
import {IProductCard} from "./product-rows";
import Link from "next/link";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {HistoryOutlined} from "@ant-design/icons";
import {server} from "../utils/server";
import axios, {AxiosResponse} from "axios";
import {api} from "../utils/axios-config";
import {ProductResponseDTO} from "../models/product/ProductResponseAPI";

export interface ElementDistance {
    distance: {
        text: string;
        value: number;
    };
    duration: {
        text: string;
        value: number;
    };
}

export interface RowElementDistance {
    elements: ElementDistance[];
}

export interface DistanceResponse {
    destination_addresses: string;
    origin_addresses: string;
    rows: RowElementDistance[];
    status: string;
}

const ProductCard = ({product}: { product: IProductCard }) => {

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const shippingAddress: AddressResponseDTO = useSelector((state: RootState) => state.address.shippingAddress);

    const selectedAddress = useSelector((state: RootState) => state.searchPosition.searchPosition);

    const [fallback, setFallback] = useState<string>('data:image/png;base64,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');

    const [distance, setDistance] = useState<string>("");

    const [time, setTime] = useState<string>("")

    // const getDistanceMatrix = async (originLat: number, originLng: number, destLat: number, destLng: number) => {
    //     const apiKey: string = 'dXWhFMOOlIYRZhbprENdNjcoAtYSFZOwWZiTSJEY0H1zoYNCDjk0ZfBlBOmyRYw0';
    //     const apiUrl: string = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${apiKey}`;
    //
    //     axios
    //         .get<DistanceResponse>(apiUrl)
    //         .then((response: AxiosResponse<DistanceResponse>): void => {
    //             console.log(response.data)
    //             const distance: string = response.data.rows[0].elements[0].distance.text;
    //             setDistance(distance);
    //             const time = Math.round(response.data.rows[0].elements[0].duration.value / 60) ;
    //             setTime(time.toString());
    //         })
    //         .catch((error): void => {
    //             console.error(error);
    //         });
    // };
    //
    // useEffect(() => {
    //     let originLat: number | null = null;
    //     let originLng: number | null = null;
    //     let destLat: number | null = null;
    //     let destLng: number | null = null;
    //
    //     if (selectedAddress != null) {
    //         originLat = selectedAddress.lat;
    //         originLng = selectedAddress.lon;
    //     } else if (currentUser && currentUser.id && selectedAddress == null) {
    //         originLat = shippingAddress.lat ?? 0;
    //         originLng = shippingAddress.lon ?? 0;
    //     }
    //
    //     if (originLng != null && originLat != null) {
    //         const productId: string = product.id;
    //
    //         api.get(`/products/${productId}`)
    //             .then(function (res: AxiosResponse<ProductResponseDTO>): void {
    //                 destLat = res.data.user?.address?.lat ?? 0;
    //                 destLng = res.data.user?.address?.lon ?? 0;
    //
    //                 getDistanceMatrix(originLat, originLng, destLat, destLng);
    //             })
    //             .catch(function (res): void {
    //                 notification.open({
    //                     type: 'error',
    //                     message: 'Product message',
    //                     description: res.message
    //                 });
    //             });
    //     }
    // }, [selectedAddress, currentUser, shippingAddress]);

    return (
        <Link href={`/${product.id}`}>
            <Card
                size='small'
                hoverable
                cover={<img alt="example"
                            className="aspect-square object-cover"
                            src={product.thumbnail ? server + product.thumbnail : fallback}/>}
            >
                <Space direction="vertical" size="small" style={{display: 'flex'}}>
                    <div className='flex items-center overflow-hidden'>
                        <Badge className='mr-1 overflow-hidden'
                               count={distance !== "" ? `Khoảng ${distance}` : "Khoảng cách không xác định"}
                               color='#F36F24'/>
                    </div>
                    <div className='text-left overflow-hidden text-ellipsis whitespace-nowrap'>
                        {product.name}
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className="mr-2">
                            <span className="mr-2">{product.rate !== 0 && product.rate.toFixed(1)}</span>
                            <Rate disabled allowHalf value={product.rate} className='text-sm mr-2'/>
                        </span>
                        <span>{product.rateCount} đánh giá</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="text-left text-[20px] font-bold">
                            ${product.minPrice}{product.maxPrice === product.minPrice ? "" : " - $" + product.maxPrice}
                        </div>
                        <div>Đã bán: {product.quantityCount}</div>
                    </div>
                </Space>
                <Divider style={{margin: '12px 0px'}}/>
                <div style={{fontSize: '14px'}}>
                    <HistoryOutlined/> {time !== "" ? `Khoảng ${time} phút` : "Thời gian không xác định"} {product.retailer}
                </div>
            </Card>
        </Link>
    );

};

export default ProductCard;
