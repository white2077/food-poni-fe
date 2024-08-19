import React, {useEffect, useState} from "react";
import {Button, Dropdown, Image, Input, MenuProps, Modal, Radio, Space} from "antd";
import {
    DeleteOutlined,
    ExclamationCircleFilled,
    EyeOutlined,
    LockOutlined,
    MailOutlined,
    PictureOutlined,
    SafetyCertificateOutlined
} from "@ant-design/icons";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {server} from "../utils/server";
import {api} from "../utils/axios-config";
import {UserAPIResponse} from "../models/user/UserAPIResponse";
import SelectedItemLabel from "./select-label";
import ChangePassword from "./change-password";
import Loading from "./loading-product";
import ComboboxDate from "./combobox-date";
import ChangeAvatar from "./change-avatar";

const {confirm} = Modal;

export const PersonalInformation = () => {

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);

    const [openUpdate, setOpenUpdate] = useState(false);

    const [open, setOpen] = useState(false);

    const [user, setUser] = useState<UserAPIResponse>({} as UserAPIResponse);

    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getUserById();
    }, [currentUser]);

    const getUserById = () => {
        setLoading(true);
        api.get("/users/" + currentUser.id)
            .then((res) => {
                setUser(res.data);
            })
            .catch(() => {
                console.log("Personal information: Can't get user information");
            })
            .finally(() => setLoading(false));
    }

    const handleAddAddressClick = (): void => {
        setShowAddAddress(!showAddAddress);
    };

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
        <div>
            {showAddAddress ? (
                <div className="w-[600px] mx-auto">
                    <div className="flex items-center">
                        <button onClick={handleAddAddressClick} className="my-2 text-[20px] font-medium text-gray-400 hover:text-gray-500">Thông tin tài khoản</button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 18 15" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z"
                                  fill="#f36f24"></path>
                        </svg>
                        <SelectedItemLabel label={"Đổi mật khẩu"}/>
                    </div>
                    <ChangePassword/>
                </div>
            ) : (
                <div>
                    <Modal
                        title="Cập nhật ảnh đại diện"
                        open={openUpdate}
                        onOk={() => setOpenUpdate(false)}
                        onCancel={() => setOpenUpdate(false)}
                        width={500}
                        height={500}
                        footer={null}
                    >
                        <ChangeAvatar/>
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
                        <img src={server + user.avatar} className="rounded-lg object-cover"/>
                    </Modal>
                    <SelectedItemLabel label={"Thông tin cá nhân"}/>
                    {isLoading ? (
                        <Loading/>
                    ) : (
                        <div className="bg-white p-3 rounded-lg grid lg:grid-cols-5 grid-cols-1 gap-4">
                            <div className="col-span-3">
                                <div className="mb-3 text-[15px] text-gray-500 font-sans">Thông tin cá nhân</div>
                                <div className="grid lg:grid-cols-4">
                                    <div className="col-span-1">
                                        <div className="flex flex-col items-center mr-5 gap-5 relative">
                                            <Dropdown menu={{items}} placement="bottom" arrow>
                                                <button
                                                    className="absolute z-50 bg-gray-400 w-5 h-5 flex justify-center items-center rounded-full bottom-2 right-2">
                                                    <img className="w-3 h-3" src="/pen.png"/></button>
                                            </Dropdown>
                                            <Image
                                                preview={false}
                                                width={110}
                                                height={110}
                                                className="z-30 object-center rounded-full shadow-lg border-4 border-orange-200 overflow-hidden object-cover "
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
                                    <ComboboxDate user={user}/>
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
                                    <Button
                                        className="w-44 !bg-primary !text-white hover:!bg-white hover:!text-[#F36F24]">Lưu
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
                                                            <div className="text-[15px] w-full ">Yêu cầu xóa tài khoản
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button>Yêu cầu</Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4">
                                            <h3 className="text-[17px] font-sans text-gray-400">Liên kết mạng xã
                                                hội</h3>
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
                    )}
                </div>
            )}
        </div>
    );
};

export default PersonalInformation;