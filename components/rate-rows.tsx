import React, {useEffect, useState} from 'react';
import {Divider, Image, Modal, notification, Rate} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import axiosConfig from "../utils/axios-config";
import FileUploads from "./file-upload";
import {CurrentUser} from "../stores/user.reducer";
import {RootState} from "../stores";
import {setShowModalRate} from "../stores/rate.reducer";
import {RateResponseDTO} from "../models/rate/RateResponseAPI";
import {AxiosResponse} from "axios";

const RateRows = ({orderId}: { orderId: string }) => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);
    const showModalRate: boolean = useSelector((state: RootState) => state.rate.showModalRate);
    const [rates, setRates] = useState<RateResponseDTO[]>([]);
    const dispatch = useDispatch();

    const getRates = (): void => {
        axiosConfig.get('/customer/orders/rate/' + orderId, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<RateResponseDTO[]>) {
                setRates(res.data);
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Order message',
                    description: res.message
                });
            })
    }

    useEffect((): void => {
        getRates();
    }, []);

    const handleModalClose = (): void => {
        dispatch(setShowModalRate(false));
    }

    return (
        <Modal title="Đánh giá của bạn" visible={showModalRate} footer={null} onCancel={handleModalClose}
               style={{userSelect: 'none'}}>
            <div style={{padding: '20px 0'}}>
                {rates.length != 0 ? rates.map((rate, index) => (
                    <div key={index}>
                        {/* Render rate number */}
                        <div><Rate value={rate.rate}/></div>
                        {/* Render message string */}
                        <div><p style={{fontSize: '20px', margin: '10px 0'}}>{rate.message}</p></div>
                        {/* Render images */}
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>
                            {rate.images && rate.images.map((url, index) => (
                                <div key={index} style={{marginRight: '10px', marginBottom: '10px'}}>
                                    <Image src={url} alt={`Image ${index}`} width={100} height={60}
                                           style={{objectFit: 'cover', cursor: 'pointer'}}/>
                                </div>
                            ))}
                        </div>
                        {/* Render product thumbnail and name */}
                        <div style={{
                            display: 'flex', alignItems: 'center', marginBottom: '10px', border: '1px solid #e0e0e0',
                            padding: '2px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '5px',
                        }}>
                            {/* Render product thumbnail */}
                            <div style={{
                                marginRight: '10px',

                            }}>
                                <Image src={rate.thumbnail} alt={`Product Thumbnail ${index}`} width={30}
                                       height={30}/>
                            </div>
                            {/* Render product name */}
                            <div>
                                <p style={{fontSize: '16px', fontWeight: 'bold', margin: '0'}}>{rate.name}</p>
                            </div>
                        </div>
                        <Divider/>
                    </div>
                )) : (
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <p>Không có đánh giá</p>
                    </div>
                )}
            </div>
            <FileUploads/>
        </Modal>
    );
};

export default RateRows;