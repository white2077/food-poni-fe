import React from "react";
import {Button, DatePicker, Image, Input, Radio} from "antd";
import {LockOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {server} from "../utils/server";

export const PersonalInformation = () => {

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    return (
        <div className='lg:w-[1000px] px-2 mx-auto items-center'>
            <div className="mt-4">
                <div className="grid lg:grid-cols-3 grid-cols-1 gap-4">
                    <div className="flex col-span-2">
                        <div className="flex flex-col items-center mr-5">
                            <Image
                                width={200}
                                height={200}
                                className="object-center rounded-full shadow-lg border-2 border-gray-100 "
                                src={server + currentUser.avatar}
                            />
                            <Button className="mt-3">Cập nhật</Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col justify-items-start align-top w-full">
                                <div className="px-4 py-4 sm:grid sm:grid-cols-[1fr,2fr] sm:gap-4 sm:px-0 mt-10">
                                    <dt className="text-lg">Username</dt>
                                    <Input value={currentUser.username}></Input>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-[1fr,2fr] sm:gap-4 sm:px-0">
                                    <dt className="text-lg">Nickname</dt>
                                    <Input placeholder="Thêm nickname"></Input>
                                </div>
                                <div className="flex justify-around mt-10">
                                    <Button>Lưu thay đổi</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-l-2">
                        <div className="px-4">
                            <h3 className="text-lg font-bold">Email</h3>
                            <div className="p-4 grid gap-3">
                                <div className="flex justify-between w-[200px]">
                                    <div className="flex items-center gap-2">
                                        <MailOutlined/>
                                        <div className="text-lg text-gray-600 ml-2 mr-10">
                                            <div>Địa chỉ email</div>
                                            <div>{currentUser.email}</div>
                                        </div>
                                    </div>
                                    <Button>Cập nhật</Button>
                                </div>
                            </div>
                        </div>
                        <div className="px-4">
                            <h3 className="text-lg font-bold">Bảo mật</h3>
                            <div className="p-4 grid gap-3">
                                <div className="flex justify-between w-[200px]">
                                    <div className="flex items-center gap-2">
                                        <LockOutlined />
                                        <div className="text-lg text-gray-600 ml-2 mr-10">
                                            <div>Đổi mật khẩu</div>
                                            <div>{currentUser.email}</div>
                                        </div>
                                    </div>
                                    <Button>Cập nhật</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInformation;