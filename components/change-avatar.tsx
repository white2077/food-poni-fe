import React, {useState} from 'react';
import {Button, notification} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import FileUploads from "./file-upload";
import {RootState} from "../stores";
import {setShowModalFileUpload} from "../stores/rate.reducer";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {UserUpdateAvatarRequestDTO} from "../models/user/UserRequest";
import {unSelectedMultiFile} from "../stores/file-uploads.reducer";
import {NextRouter, useRouter} from "next/router";
import {updateAvatar} from "../stores/user.reducer";

const ChangeAvatar = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const refreshToken = getCookie(REFRESH_TOKEN);

    const images: string[] = useSelector((state: RootState) => state.fileUpload.selectedMultiFile);

    const [selectedFile, setSelectedFile] = useState<string>("");

    const handleToggleFileSelect = (fileUrl: string): void => {
        setSelectedFile(fileUrl);
    };

    const changeAvatar = (image: string) => {

        const changeAvatarRequest: UserUpdateAvatarRequestDTO = {} as UserUpdateAvatarRequestDTO;

        changeAvatarRequest.avatar = image;

        if (refreshToken) {
            apiWithToken(refreshToken).patch('/users/update-avatar', changeAvatarRequest, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(() => {
                    dispatch(updateAvatar(image));
                    router.push("/account-information");
                    notification.open({
                        type: 'success',
                        message: 'Ảnh đại diện',
                        description: 'Cập nhật ảnh đại diện thành công!',
                    });
                })
                .catch((res) => {
                    notification.open({
                        type: 'error',
                        message: 'Ảnh đại diện',
                        description: res.message
                    });
                }).finally(() => {
                    dispatch(unSelectedMultiFile());
                }
            );
        }
        return changeAvatarRequest;
    }

    const handleSubmit = (): void => {
        changeAvatar(selectedFile) ?? {} as UserUpdateAvatarRequestDTO;
    };

    return (
        <div>
            <div className="p-1">
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 overflow-scroll scrollbar-rounded max-h-96">
                    <div>
                        <Button className="w-full !h-32"
                                onClick={() => dispatch(setShowModalFileUpload(true))}>Chọn ảnh</Button>
                    </div>
                    {images.map((url, index) => (
                        <div key={index} className="relative inline-block">
                            <div
                                onClick={() => handleToggleFileSelect(url)}>
                                <img src={url}
                                     alt={`Image ${index}`}
                                     className="w-32 h-32 object-cover rounded-lg"
                                />
                                <div
                                    className="flex border-2 border-orange-200 absolute top-1 w-6 h-6 right-1 rounded-full"
                                    style={{backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
                                    {selectedFile.includes(url) && (
                                        <div onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleFileSelect(url);
                                        }}
                                             className="flex justify-center items-center w-full h-full bg-orange-400 text-white rounded-full">✓</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <Button type="primary" onClick={handleSubmit}>Cập nhật</Button>
                </div>
            </div>
            <FileUploads/>
        </div>
    );
};

export default ChangeAvatar;