import React, {useState} from "react";
import {Button, Card, Dropdown, Image, Input, List, type MenuProps, Modal, Radio, Space} from "antd";
import {
    CheckCircleOutlined,
    DeleteOutlined, EyeOutlined,
    LockOutlined,
    MailOutlined, PictureOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {server} from "../utils/server";
import ComboBoxDate from "./comboBox-date";
import ChangePassword from "./change-password";
import SelectedItemLabel from "./select-label";
import UploadImg from "./upload";
import {ExclamationCircleFilled} from '@ant-design/icons';

const {confirm} = Modal;
export const PersonalInformation = () => {

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);
    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
    const handleAddAddressClick = (): void => {
        setShowAddAddress(!showAddAddress);
    };
    const [openUpdate, setOpenUpdate] = useState(false);
    const [open, setOpen] = useState(false);
    const showDeleteConfirm = () => {
        confirm({
            title: 'Bạn có chắc muốn xoá ảnh đại diện ?',
            icon: <ExclamationCircleFilled/>,
            content: 'Hình ảnh đại diện sẽ quay về mặc định của FoodPoni',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <button onClick={() => setOpen(true)}>
                    <PictureOutlined/> Xem ảnh đại diện
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button onClick={() => setOpenUpdate(true)}>
                    <EyeOutlined/> Cập nhật ảnh đại diện
                </button>
            ),
        },
        {
            key: '3',
            label: (
                <button onClick={showDeleteConfirm}>
                    <DeleteOutlined/> Xóa ảnh đại diện hiện tại
                </button>

            ),
        },
    ];

    return (
        <>

            {showAddAddress && (
                <div className="w-[600px] mx-auto">
                    <SelectedItemLabel label={"Đổi mật khẩu"}/>
                    <ChangePassword/>
                </div>
            )}
            {!showAddAddress && (
                <>
                    <Modal
                        title="Cập nhật ảnh đại diện"
                        centered
                        open={openUpdate}
                        onOk={() => setOpenUpdate(false)}
                        onCancel={() => setOpenUpdate(false)}
                        width={500}
                        height={500}
                    >
                        <UploadImg/>
                    </Modal>
                    <Modal
                        title="Xem ảnh đại diện"
                        centered
                        open={open}
                        onOk={() => setOpen(false)}
                        onCancel={() => setOpen(false)}
                        width={500}
                        height={500}
                        footer={null}
                    >
                        <Image alt=""
                               className="object-center rounded-lg  object-cover w-full h-full"
                               src={server + currentUser.avatar}
                        />
                    </Modal>
                    <SelectedItemLabel label={"Thông tin cá nhân"}/>
                    <div className="bg-white p-3 rounded-lg grid lg:grid-cols-5 grid-cols-1 gap-4">
                        <div className="col-span-3">
                            <div className="mb-3 text-[15px] text-gray-500 font-sans">Thông tin cá nhân</div>
                            <div className="grid lg:grid-cols-4">
                                <div className="col-span-1">
                                    <div className="flex flex-col items-center mr-5 gap-5 relative">
                                        <Dropdown menu={{items}} placement="bottom" arrow>
                                            <div
                                                className=" cursor-pointer absolute bg-gray-600 z-30 right-1 bottom-1 rounded-full w-5 h-5 flex justify-center items-center">
                                                <img src="/pen.png" className="w-3 h-3"/>
                                            </div>
                                        </Dropdown>
                                        <Image
                                            preview={false}
                                            width={110}
                                            height={110}
                                            className="object-center rounded-full shadow-lg border-4 border-orange-200 overflow-hidden object-cover z-20"
                                            src={server + currentUser.avatar}
                                        />

                                    </div>
                                </div>
                                <div className="col-span-3 w-[100%] flex items-center">
                                    <div className="px-4 sm:grid sm:grid-cols-[1fr,2fr] sm:gap-4 sm:px-0 ">
                                        <dt className="text-[15px] flex items-center font-sans">Họ & Tên</dt>
                                        <Input value={currentUser.username}></Input>
                                    </div>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-4 mt-4">
                                <div className="col-span-1 w-[100%]">
                                    <div className="flex justify-start items-center gap-5">
                                        Ngày sinh
                                    </div>
                                </div>
                                <ComboBoxDate/>
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
                                                <Radio value={true}>
                                                    <p>Nam</p>
                                                </Radio>
                                                <Radio value={false}>
                                                    <p>Nữ</p>
                                                </Radio>
                                            </div>
                                        </Space>
                                    </Radio.Group>
                                </div>
                            </div>
                            <div className="mt-8 text-center">
                                <Button className="w-44 !bg-primary !text-white hover:!bg-white hover:!text-[#F36F24]">Lưu
                                    thay
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
                                                        <div className="text-[15px] w-full">{currentUser.email}</div>
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
                                                <Button onClick={handleAddAddressClick}>Cập nhật</Button>
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
                </>
            )}
        </>

    );
};

export default PersonalInformation;