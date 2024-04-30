import React, {useState} from 'react';
import {Button, Input, Modal, notification, Rate} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import axiosConfig from "../utils/axios-config";
import FileUploads from "./file-upload";
import {CurrentUser} from "../stores/user.reducer";
import {RootState} from "../stores";
import {setLoadingOrderItem} from "../stores/order.reducer";
import {setShowModalAddRate, setShowModalFileUpload} from "../stores/rate.reducer";
import {setSelectedFile} from "../stores/fileUploads.reducer";
import {IProductCard} from "./product-rows";
import {RateResponseDTO} from "../models/rate/RateResponseAPI";

const RateRows = ({orderId}: { orderId: string }) => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser) as CurrentUser;
    const showModalRate: boolean = useSelector((state: RootState) => state.rate.showModalRate);
    const [rate, setRate] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const dispatch = useDispatch();

    const getRates = () => {

    }

    // Handler for rate change
    const handleRateChange = (value: number) => {
        setRate(value);
    };

    // Handler for message change
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    const handleSubmit = () => {
        const rateDTO: RateDTO = createRateDTO(rate, message, images) ?? {};
        console.log(rateDTO); // You can use rateDTO for further processing
    };

    const handleModalClose = () => {
        dispatch(setShowModalAddRate(false));
        dispatch(setSelectedFile([]));
        setRate(0);
        setMessage("");
    }

    const handlePreview = (url: string) => {
        setPreviewImage(url);
        setPreviewOpen(true);
    };

    // Render
    return (
        <Modal title="Đánh giá sản phẩm" visible={showModalAddRate} footer={null} onCancel={handleModalClose}>
            <div style={{padding: "20px 0"}}>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Rate value={rate} style={{fontSize: '50px'}} onChange={handleRateChange}/>
                </div>
                <div style={{margin: "20px 0"}}>
                    <Input.TextArea showCount maxLength={100} placeholder="Nhập tin nhắn đánh giá"
                                    onChange={handleMessageChange} value={message}/>
                </div>
                <div style={{display: "flex", justifyContent: "left", flexWrap: "wrap"}}>
                    <div style={{padding: "8px"}}>
                        <Button style={{width: "100px", height: "100px"}}
                                onClick={() => dispatch(setShowModalFileUpload(true))}>Chọn ảnh</Button>
                    </div>
                    {images.map((url, index) => (
                        <div key={index} style={{display: 'inline-block', margin: '8px'}}>
                            <img
                                src={url}
                                alt={`Image ${index}`}
                                onClick={() => handlePreview(url)}
                                style={{width: '100px', height: '100px', cursor: 'pointer'}}
                            />
                        </div>
                    ))}
                    {previewImage && (
                        <div>
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{maxWidth: '100%', maxHeight: '100%', cursor: 'pointer'}}
                                onClick={() => setPreviewOpen(false)}
                            />
                        </div>
                    )}
                </div>
                <div style={{marginTop: 20, textAlign: "center"}}>
                    <Button type="primary" onClick={handleSubmit}>Gửi đánh giá</Button>
                </div>
            </div>
            <FileUploads/>
        </Modal>
    );
};

export default RateRow;