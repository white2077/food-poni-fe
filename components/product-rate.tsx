import {useDispatch} from "react-redux";
import {RateResponseDTO} from "../models/rate/RateResponseAPI";
import React, {useEffect, useState} from "react";
import {AxiosResponse} from "axios";
import {Col, Divider, Image, notification, Rate, Row} from "antd";
import {setShowModalRate} from "../stores/rate.reducer";
import {Page} from "../models/Page";
import {api} from "../utils/axios-config";

const ProductRate = ({productId}: { productId: string }) => {

    const dispatch = useDispatch();

    const [rates, setRates] = useState<RateResponseDTO[]>([]);

    const getRates = () => {
        api.get('/products/rate/' + productId)
            .then(function (res: AxiosResponse<Page<RateResponseDTO[]>>) {
                console.log(res.data.content);
                setRates(res.data.content);
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Order message',
                    description: res.message
                });
            })
    }

    useEffect(() => {
        getRates();
    }, []);

    const handleModalClose = () => {
        dispatch(setShowModalRate(false));
    }

    return (
        <Row style={{padding: '20px 30px', width: '100%'}}>
            {rates && rates.map((rate, index) => (
                <div key={index} style={{width: '100%'}}>
                    <Row gutter={[16, 16]} align="top">
                        <Col span={1}>
                            <Image src={rate.avatar}
                                   style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}/>
                        </Col>
                        <Col span={23}>
                            <Row>
                                <span>{rate.username}</span>
                            </Row>
                            <Row>
                                <Rate disabled defaultValue={rate.rate}/>
                            </Row>
                            <Row style={{padding: '15px 0'}}>
                                <span>{rate.message}</span>
                            </Row>
                            <Row>
                                {rate.images && rate.images.length > 0 && (
                                    <Row gutter={[16, 16]}>
                                        {rate.images.map((url, imageIndex) => (
                                            <Col key={imageIndex}>
                                                <Image src={url} width={80} height={80} style={{objectFit: 'cover'}}/>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Row>
                        </Col>
                    </Row>
                    <Divider/>
                </div>
            ))}
        </Row>
    )
};

export default ProductRate;



