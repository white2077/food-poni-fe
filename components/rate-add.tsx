import React, {useState} from 'react';
import {Button, Image, Input, Modal, notification, Rate} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import FileUploads from "./file-upload";
import {RootState} from "../stores";
import {setLoadingOrderItem} from "../stores/order.reducer";
import {setShowModalAddRate, setShowModalFileUpload} from "../stores/rate.reducer";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {RateRequest} from "../models/rate/RateRequest";
import {selectedMultiFile} from "../stores/file-uploads.reducer";

const RateAdd = () => {

    const dispatch = useDispatch();

    const refreshToken = getCookie(REFRESH_TOKEN);

    const showModalAddRate: boolean = useSelector((state: RootState) => state.rate.showModalAddRate);

    const orderItemId: string = useSelector((state: RootState) => state.rate.selectOrderItemRate);

    const images: string[] = useSelector((state: RootState) => state.fileUpload.selectedMultiFile);

    const [rate, setRate] = useState<number>(0);

    const [message, setMessage] = useState<string>('');

    const [previewOpen, setPreviewOpen] = useState(false);

    const [previewImage, setPreviewImage] = useState('');

    const createRate = (rate: number, message: string, images: string[]) => {

        const rateRequest: RateRequest = {} as RateRequest;
        if (rate !== 0) {
            rateRequest.rate = rate;
        } else {
            notification.open({
                type: "error",
                message: "Đánh giá",
                description: "Vui lòng nhập đầy đủ thông tin"
            });
            return;
        }
        if (message !== "") {
            rateRequest.message = message;
        }
        if (images.length > 0) {
            rateRequest.images = images;
        }
        dispatch(setLoadingOrderItem(true));
        if (refreshToken) {
            apiWithToken(refreshToken).post('/order-items/rate/' + orderItemId, rateRequest, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(() => {
                    notification.open({
                        type: 'success',
                        message: 'Đánh giá',
                        description: 'Đánh giá thành công!',
                    });
                    handleModalClose();
                })
                .catch((res) => {
                    notification.open({
                        type: 'error',
                        message: 'Đánh giá',
                        description: res.message
                    });
                }).finally(() => {
                    setTimeout(() => {
                        dispatch(setLoadingOrderItem(false));
                    }, 1000)
                }
            );
        }
        return rateRequest;
    }

    // Handler for rate change
    const handleRateChange = (value: number): void => {
        setRate(value);
    };

    // Handler for message change
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setMessage(e.target.value);
    };

    const handleSubmit = (): void => {
        createRate(rate, message, images) ?? {} as RateRequest;
    };

    const handleModalClose = (): void => {
        dispatch(setShowModalAddRate(false));
        dispatch(selectedMultiFile([]));
        setRate(0);
        setMessage("");
    }

    return (
        <Modal title="Đánh giá sản phẩm" open={showModalAddRate} footer={null} onCancel={handleModalClose}>
            <div className="p-1">
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Rate value={rate} style={{fontSize: '50px'}} onChange={handleRateChange}/>
                </div>
                <div style={{margin: "20px 0"}}>
                    <Input.TextArea showCount maxLength={100} placeholder="Nhập tin nhắn đánh giá"
                                    onChange={handleMessageChange} value={message}/>
                </div>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 overflow-scroll scrollbar-rounded max-h-96">
                    <div>
                        <Button style={{width: '100%', height: '8rem'}}
                                onClick={() => dispatch(setShowModalFileUpload(true))}>Chọn ảnh</Button>
                    </div>
                    {images.map((url, index) => (
                        <div key={index}>
                            <Image
                                src={url}
                                alt={`Image ${index}`}
                                style={{width: '8rem', height: '8rem', objectFit: 'cover', borderRadius: '0.5rem'}}
                            />
                        </div>
                    ))}
                </div>
                <div style={{marginTop: 20, textAlign: "center"}}>
                    <Button type="primary" onClick={handleSubmit}>Gửi đánh giá</Button>
                </div>
            </div>
            <FileUploads/>
        </Modal>
    );
};

export default RateAdd;