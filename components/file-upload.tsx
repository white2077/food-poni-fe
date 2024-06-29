import {Button, Card, Divider, List, message, Modal, notification, Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {FileUploadsResponseDTO} from "../models/file/FileUploadsResponseAPI";
import {UploadOutlined} from "@ant-design/icons";
import {setFileUploads, setSelectedFile} from "../stores/fileUploads.reducer";
import {setShowModalFileUpload} from "../stores/rate.reducer";
import store, {RootState} from "../stores";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AxiosError, AxiosResponse} from "axios";
import {Page} from "../models/Page";
import {ErrorApiResponse} from "../models/ErrorApiResponse";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";

export interface IFileUploadCard {
    id: string;
    name: string;
    extension: string;
    contentType: string;
    size: number;
    url: string;
}

const FileUploads = () => {

    const dispatch = useDispatch();

    const refreshToken = getCookie(REFRESH_TOKEN);

    const fileUploads: FileUploadsResponseDTO[] = useSelector((state: RootState) => state.fileUpload.filesUpload);

    const showModalFileUpload: boolean = useSelector((state: RootState) => state.rate.showModalFileUpload);

    const [hoveredFile, setHoveredFile] = useState<string | null>(null);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const [messageApi, contextHolder] = message.useMessage();

    useEffect((): void => {
        getFileUploads();
    }, []);

    const getFileUploads = (): void => {
        if (refreshToken) {
            apiWithToken(store.dispatch, refreshToken).get('/file-uploads', {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then((res: AxiosResponse<Page<FileUploadsResponseDTO[]>>): void => {
                    dispatch(setFileUploads(res.data.content));
                })
                .catch(function (err: AxiosError<ErrorApiResponse>) {
                    console.log(err)
                });
        }
    };

    const handleToggleFileSelect = (fileUrl: string): void => {
        setSelectedFiles(prevSelectedFiles => {
            // Kiểm tra xem fileUrl có trong danh sách đã chọn không
            const isSelected = prevSelectedFiles.includes(fileUrl);
            // Nếu fileUrl đã được chọn, loại bỏ nó khỏi danh sách
            if (isSelected) {
                return prevSelectedFiles.filter(url => url !== fileUrl);
            } else {
                // Nếu fileUrl chưa được chọn, thêm nó vào danh sách
                return [...prevSelectedFiles, fileUrl];
            }
        });
    };

    const uploadFile = async (options: any): Promise<void> => {
        const {file} = options;
        const formData = new FormData();
        formData.append('multipartFile', file);

        if (refreshToken) {
            apiWithToken(store.dispatch, refreshToken).post("/file-uploads", formData, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(function () {
                    // setPending(false);
                    // dispatch(deleteAllItem({}));
                    notification.open({
                        type: 'success',
                        message: 'Rate',
                        description: 'Rate success!',
                    });
                    getFileUploads();
                })
                .catch(function (res) {
                    // setPending(false);
                    notification.open({
                        type: 'error',
                        message: 'Rate message',
                        description: res.message
                    });
                });
        }
    };

    const props = {
        customRequest: uploadFile,
        showUploadList: false,
    };

    const handleSetFileUpload = (): void => {
        if (selectedFiles.length > 0) {
            dispatch(setSelectedFile(selectedFiles));
            dispatch(setShowModalFileUpload(false));
        } else {
            messageApi.open({
                type: 'warning',
                content: 'You have not selected any images.',
            });
        }
    }

    return (
        <Modal title="Upload Files" visible={showModalFileUpload} footer={null}
               onCancel={() => dispatch(setShowModalFileUpload(false))}>
            <List
                grid={{gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4}}
                dataSource={fileUploads}
                renderItem={(file: FileUploadsResponseDTO) => (
                    <List.Item style={{padding: 0}}>
                        <Card
                            onClick={() => handleToggleFileSelect(file.url)}
                            style={{position: 'relative', height: '100px'}} // Đặt chiều cao cố định cho thẻ Card
                            hoverable
                            cover={<img src={file.url} alt={file.name} style={{maxWidth: '100%', height: '100px'}}/>}
                            onMouseEnter={() => setHoveredFile(file.url)}
                            onMouseLeave={() => setHoveredFile(null)}
                        >
                            {selectedFiles.includes(file.url) && (
                                <Button
                                    type="primary"
                                    style={{position: 'absolute', top: '10px', right: '10px'}}
                                    onClick={() => handleToggleFileSelect(file.url)}
                                >
                                    ✓
                                </Button>
                            )}
                            {hoveredFile === file.url && (
                                <Button
                                    type="primary"
                                    style={{position: 'absolute', top: '10px', right: '10px'}}
                                >
                                    ✓
                                </Button>
                            )}
                        </Card>
                    </List.Item>
                )}
            />
            <Divider/>
            <div style={{marginTop: 20, textAlign: "right"}}>
                {contextHolder}
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Upload</Button>
                </Upload>
                <Button type="primary" style={{marginLeft: 10}} onClick={handleSetFileUpload}>Chọn ảnh</Button>
            </div>
        </Modal>
    );

};

export default FileUploads;