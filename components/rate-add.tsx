import React, {useState} from 'react';
import {Button, Input, Modal, notification, Rate} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import FileUploads from "./file-upload";
import {CurrentUser} from "../stores/user.reducer";
import {RootState} from "../stores";
import {RateDTO} from "../models/order/OrderRequest";
import {setLoadingOrderItem} from "../stores/order.reducer";
import {setShowModalAddRate, setShowModalFileUpload} from "../stores/rate.reducer";
import {setSelectedFile} from "../stores/fileUploads.reducer";
import axiosInterceptor from "../utils/axiosInterceptor";

const RateAdd = () => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);
    const showModalAddRate: boolean = useSelector((state: RootState) => state.rate.showModalAddRate);
    const orderItemId: string = useSelector((state: RootState) => state.rate.selecOrderItemRate);
    const images: string[] = useSelector((state: RootState) => state.fileUpload.selectedFile);
    const [rate, setRate] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const dispatch = useDispatch();

    const createRateDTO = (rate: number, message: string, images: string[]) => {
        // Thêm các trường vào đối tượng RateDTO nếu chúng được cung cấp
        const rateDTO: RateDTO = {};
        if (rate !== 0) {
            rateDTO.rate = rate;
        } else {
            notification.open({
                type: "error",
                message: "Rate message",
                description: "Some information is missing. Please fill in all required fields."
            });
            return;
        }
        if (message !== "") {
            rateDTO.message = message;
        }
        if (images.length > 0) {
            rateDTO.images = images;
        }
        dispatch(setLoadingOrderItem(true));
        axiosInterceptor.post('/order-items/rate/' + orderItemId, rateDTO, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(() => {
                notification.open({
                    type: 'success',
                    message: 'Rate',
                    description: 'Rate success!',
                });
                handleModalClose();
            })
            .catch((res) => {
                notification.open({
                    type: 'error',
                    message: 'Rate message',
                    description: res.message
                });
            }).finally(() => {
                setTimeout(() => {
                    dispatch(setLoadingOrderItem(false));
                }, 1000)
            }
        );
        return rateDTO;
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
        const rateDTO: RateDTO = createRateDTO(rate, message, images) ?? {};
        console.log(rateDTO); // You can use rateDTO for further processing
    };

    const handleModalClose = (): void => {
        dispatch(setShowModalAddRate(false));
        dispatch(setSelectedFile([]));
        setRate(0);
        setMessage("");
    }

    const handlePreview = (url: string): void => {
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

export default RateAdd;