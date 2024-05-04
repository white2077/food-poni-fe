import React from "react";
import {Button, DatePicker, Image, Input, Radio} from "antd";
import {MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";

const options = ['Nam', 'Nữ', 'Khác'];
export const PersonalInformation = () => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    return (
        <div  className='lg:w-[1000px] px-2 mx-auto items-center' >
            <div className="mt-4">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <Image
                                width={150}
                                height={110}
                                className="object-center rounded-full shadow-lg border-2 border-gray-100"
                                src={currentUser.avatar}
                            />
                            <div className="flex flex-col justify-items-start align-top w-full">
                                <div className="px-4 py-4 sm:grid sm:grid-cols-[1fr,2fr] sm:gap-4 sm:px-0">
                                    <dt className="text-lg font-serif leading-6 text-gray-600">Họ và tên</dt>
                                    <Input value={currentUser.username}></Input>
                                </div>
                                <div className="px-4 py-4 sm:grid sm:grid-cols-[1fr,2fr] sm:gap-4 sm:px-0">
                                    <dt className="text-lg font-serif leading-6 text-gray-600">Nickname</dt>
                                    <Input></Input>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-items-start align-top">
                            <div className="px-4 py-4 sm:grid sm:grid-cols-[1fr,2fr] sm:gap-4 sm:px-0">
                                <dt className="text-lg font-serif leading-6 text-gray-600">Ngày sinh</dt>
                                <DatePicker />
                            </div>
                            <div className="px-4 py-4 sm:grid sm:grid-cols-[1fr,2fr] sm:gap-4 sm:px-0">
                                <dt className="text-lg font-serif leading-6 text-gray-600">Giới tính</dt>
                                <Radio.Group options={options} />
                            </div>
                        </div>
                    </div>
                    <div className="border-l-2">
                        <div className="px-4">
                            <h3 className="text-lg font-semibold leading-7 text-gray-600">Số điện thoại và Email</h3>
                            <div className="p-4 grid gap-3">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <PhoneOutlined />
                                        <div>
                                            <dt className="text-lg font-serif leading-6 text-gray-600">Số điện thoại
                                            </dt>
                                            <dt>{currentUser.phoneNumber}</dt>
                                        </div>
                                    </div>
                                    <Button>Cập nhật</Button>
                                </div>
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <MailOutlined />
                                        <dt className="text-lg font-serif leading-6 text-gray-600">Địa chỉ email</dt>
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