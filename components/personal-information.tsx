import React, {useEffect, useState} from "react";
import {Button, Image, Input, Radio, Space} from "antd";
import {DeleteOutlined, LockOutlined, MailOutlined, SafetyCertificateOutlined} from "@ant-design/icons";
import {CurrentUser, setCurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {server} from "../utils/server";
import ComboBoxDate from "./comboBox_date";
import {api} from "../utils/axios-config";
import {UserAPIResponse} from "../models/user/UserAPIResponse";

export const PersonalInformation = () => {

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [user, setUser] = useState<UserAPIResponse>({} as UserAPIResponse);

    useEffect(() => {
        api.get("/users/" + currentUser.id)
            .then(function (res) {
                setUser(res.data);
            })
            .catch(function () {
                console.log("Personal information: Can't get user information");
            })
    }, [currentUser]);

    return (
        <div className="bg-white p-3 rounded-lg grid lg:grid-cols-5 grid-cols-1 gap-4">
            <div className="col-span-3">
                <div className="mb-3 text-[15px] text-gray-500 font-sans">Thông tin cá nhân</div>
                <div className="grid lg:grid-cols-4">
                    <div className="col-span-1">
                        <div className="flex flex-col items-center mr-5 gap-5">
                            <Image
                                width={110}
                                height={110}
                                className="object-center rounded-full shadow-lg border-4 border-orange-200 overflow-hidden object-cover "
                                src={server + user.avatar}
                            />
                        </div>
                    </div>
                    <div className="col-span-3 w-[100%] flex items-center">
                        <div className="px-4 sm:grid sm:grid-cols-[1fr,2fr] sm:gap-4 sm:px-0 ">
                            <dt className="text-[15px] flex items-center font-sans">Họ & Tên</dt>
                            <Input value={user.username}></Input>
                        </div>
                    </div>
                </div>
                <div className="grid lg:grid-cols-4 mt-4">
                    <div className="col-span-1 w-[100%]">
                        <div className="flex justify-start items-center gap-5">
                            Ngày sinh
                        </div>
                    </div>
                    <ComboBoxDate user={user}/>
                </div>
                <div className="grid lg:grid-cols-4 mt-8">
                    <div className="col-span-1 w-[100%]">
                        <div className="flex justify-start items-center gap-5">
                            Giới tính
                        </div>
                    </div>
                    <div>
                        <Radio.Group defaultValue={true}>
                            <Space direction="vertical">
                                <div className="flex gap-2">
                                    <Radio value={user.gender === true ? true : false}>
                                        <p>Nam</p>
                                    </Radio>
                                    <Radio value={user.gender === false ? true : false}>
                                        <p>Nữ</p>
                                    </Radio>
                                </div>
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <Button className="w-44 !bg-primary !text-white hover:!bg-white hover:!text-[#F36F24]">Lưu thay
                        đổi</Button>
                </div>
            </div>
            <div className="col-span-2">
                <div className="grid lg:grid-cols-2">
                    <div className="border-l-2 col-span-2">
                        <div className="px-4">
                            <h3 className="text-[17px] font-sans text-gray-400">Email</h3>
                            <div className="p-4 grid gap-3">
                                <div className="flex items-center gap-2 justify-between w-[100%]">
                                    <div className="flex items-center gap-2 w-[100%]">
                                        <MailOutlined/>
                                        <div className="text-lg text-gray-600 ml-2 ">
                                            <div className="text-[15px]">Địa chỉ email</div>
                                            <div className="text-[15px] w-full">{user.email}</div>
                                        </div>
                                    </div>
                                    <Button>Cập nhật</Button>
                                </div>
                            </div>
                        </div>
                        <div className="px-4">
                            <h3 className="text-[17px] font-sans text-gray-400">Bảo mật</h3>
                            <div className="p-4 grid gap-3">
                                <div className="flex items-center gap-2 justify-between w-[100%]">
                                    <div className="flex items-center gap-2 w-[100%]">
                                        <LockOutlined/>
                                        <div className="text-lg text-gray-600 ml-2 ">
                                            <div className="text-[15px]">Đổi mật khẩu</div>
                                        </div>
                                    </div>
                                    <Button>Cập nhật</Button>
                                </div>
                            </div>
                            <div className="p-4 grid gap-3">
                                <div className="flex items-center gap-2 justify-between w-[100%]">
                                    <div className="flex items-center gap-2 w-[100%]">
                                        <SafetyCertificateOutlined/>
                                        <div className="text-lg text-gray-600 ml-2 ">
                                            <div className="text-[15px]">Bảo mật</div>
                                        </div>
                                    </div>
                                    <Button>Thiết lập</Button>
                                </div>
                            </div>
                            <div className="p-4 grid gap-3">
                                <div className="flex items-center gap-2 justify-between w-[100%]">
                                    <div className="flex items-center gap-2 w-[100%]">
                                        <DeleteOutlined/>
                                        <div className="text-lg text-gray-600 ml-2  w-full">
                                            <div className="text-[15px] w-full ">Yêu cầu xóa tài khoản</div>
                                        </div>
                                    </div>
                                    <Button>Yêu cầu</Button>
                                </div>
                            </div>
                        </div>
                        <div className="px-4">
                            <h3 className="text-[17px] font-sans text-gray-400">Liên kết mạng xã hội</h3>
                            <div className="p-4 grid gap-3">
                                <div className="flex items-center gap-2 justify-between w-[100%]">
                                    <div className="flex items-center gap-2 w-[100%]">
                                        <img src={"/Facebook.png"} className="w-7 h-7"></img>
                                        <div className="text-lg text-gray-600 ml-2 ">
                                            <div className="text-[15px]">Facebook</div>
                                        </div>
                                    </div>
                                    <Button>Liên kết</Button>
                                </div>
                            </div>
                            <div className="p-4 grid gap-3">
                                <div className="flex items-center gap-2 justify-between w-[100%]">
                                    <div className="flex items-center gap-2 w-[100%]">
                                        <img src={"/Google.png"} className="w-7 h-7"></img>
                                        <div className="text-lg text-gray-600 ml-2 ">
                                            <div className="text-[15px]">Google</div>
                                        </div>
                                    </div>
                                    <Button>Liên kết</Button>
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