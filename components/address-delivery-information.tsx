import {Button, Card, List, notification} from "antd";
import {CheckCircleOutlined, DeleteOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {NextRouter, useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {AddressIdDTO} from "../models/address/AddressRequest";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {CurrentUser, updateAddressId} from "../stores/user.reducer";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AxiosError, AxiosResponse} from "axios";
import {setCurrentShippingAddress} from "../stores/address.reducer";
import AddressDeliveryInformationAdd from "./address-delivery-information-add";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import SelectedItemLabel from "./select-label";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";

export const AddressDeliveryInformation = ({deliveryInformation}: {deliveryInformation: AddressAPIResponse[]}) => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const refreshToken = getCookie(REFRESH_TOKEN);

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);

    const handleAddAddressClick = (): void => {
        setShowAddAddress(!showAddAddress);
    };

    const getShippingAddress = (): void => {
        const addressId: string = currentUser.addressId ?? "";

        if (addressId !== "" && refreshToken) {
            apiWithToken(refreshToken).get(`/addresses/${addressId}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function (res: AxiosResponse<AddressAPIResponse>): void {
                    dispatch(setCurrentShippingAddress(res.data));
                })
                .catch(function (res: AxiosError<ErrorAPIResponse>): void {
                    console.log("Shipping address message: ", res.message);
                });
        }
    };

    const deleteDeliveryInformation = (addressId: string): void => {
        if (refreshToken) {
            apiWithToken(refreshToken).delete(`/addresses/${addressId}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function (): void {
                    router.push("/account-information");
                })
                .catch(function (res): void {
                    notification.open({
                        type: 'error',
                        message: 'Địa chỉ',
                        description: res.message
                    });
                })
        }
    };

    const updateShippingAddress = (addressId: string): void => {
        const addressIdDTO: AddressIdDTO = {
            id: addressId
        };
        if (refreshToken) {
            apiWithToken(refreshToken).patch("/users/update-address", addressIdDTO, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function (): void {
                    dispatch(updateAddressId(addressId));
                    router.push("/account-information");
                    getShippingAddress();

                    notification.open({
                        type: 'success',
                        message: 'Địa chỉ',
                        description: "Thay đổi địa chỉ mặc định thành công!"
                    });
                })
                .catch(function (res): void {
                    notification.open({
                        type: 'error',
                        message: 'Địa chỉ',
                        description: res.message
                    });
                });
        }
    };

    return (
        <>
            <SelectedItemLabel label={"Sổ địa chỉ"}/>
            <div className="w-[1000px] mx-auto">
                <Button
                    className="my-[16px]"
                    onClick={handleAddAddressClick}>{showAddAddress ? "Quay lại" : "Thêm địa chỉ"}</Button>
                {showAddAddress && (
                    <div className="w-[600px] mx-auto"><AddressDeliveryInformationAdd/></div>
                )}
                {!showAddAddress && (
                    <List
                        grid={{gutter: 16, column: 1}}
                        dataSource={deliveryInformation}
                        renderItem={(item: AddressAPIResponse) => (
                            <List.Item>
                                <Card>
                                    <div className="flex justify-between">
                                        <div>
                                            <div>
                                                <span className="font-bold mr-[8px]">{item.fullName}</span>
                                                <span className="mr-[8px]">|</span>
                                                <span className="mr-[8px]">{item.phoneNumber}</span>
                                                {(item.id === currentUser.addressId) &&
                                                    <span className="text-green-600"><CheckCircleOutlined/> Địa chỉ mặc định</span>
                                                }
                                            </div>
                                            <div>{item.address}</div>
                                        </div>
                                        <div>
                                            <Button type="text" className="!text-purple-600"
                                                    onClick={() => updateShippingAddress(item.id ?? "")}>
                                                Đặt làm mặc định
                                            </Button>
                                            <span className="ml-[16px]"
                                                  hidden={item.id === currentUser.addressId}><DeleteOutlined
                                                onClick={() => deleteDeliveryInformation(item.id ?? "")}/></span>
                                        </div>
                                    </div>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </>
    );

};

export default AddressDeliveryInformation;