import {Button, Card, Divider, List, Modal, notification, Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {FileUploadsResponseDTO} from "../models/file/FileUploadsResponseAPI";
import {UploadOutlined} from "@ant-design/icons";
import {Page} from "../models/Page";
import {setFileUploads, setSelectedFile} from "../stores/fileUploads.reducer";
import {setShowModalFileUpload} from "../stores/rate.reducer";
import {CurrentUser} from "../stores/user.reducer";
import {RootState} from "../stores";

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

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser) as CurrentUser;

    const fileUploads = useSelector((state: RootState) => state.fileUpload.filesUpload);

    const showModalFileUpload = useSelector((state: RootState) => state.rate.showModalFileUpload);

    // const [selectedFiles, setSelectedFiles] = useState<FileUploadsResponseDTO[]>([]);

    const [hoveredFile, setHoveredFile] = useState<string | null>(null);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    useEffect((): void => {
        getFileUploads();
    }, []);

    const getFileUploads = (): void => {
        axiosConfig.get(`/file-uploads`, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then((res: AxiosResponse<Page<FileUploadsResponseDTO[]>>): void => {
                dispatch(setFileUploads(res.data.content));
            })
            .catch(err => {
                console.log(err)
            });

    };

    const handleToggleFileSelect = (fileUrl: string) => {
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

    const uploadFile = async (options : any) => {
        const {file} = options;
        const formData = new FormData();
        formData.append('multipartFile', file);
        axiosConfig.post("/file-uploads", formData, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
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
    };

    const props = {
        customRequest: uploadFile,
        showUploadList: false,
    };

    const handleSetFileUpload = () => {
        dispatch(setSelectedFile(selectedFiles));
        dispatch(setShowModalFileUpload(false));
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
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Upload</Button>
                </Upload>
                <Button type="primary" style={{marginLeft: 10}} onClick={handleSetFileUpload}>Chọn ảnh</Button>
            </div>
        </Modal>
    );

};

export default FileUploads;