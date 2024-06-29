import {Button, Card, List, notification} from "antd";
import {CheckCircleOutlined, DeleteOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {NextRouter, useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import store, {RootState} from "../stores";
import {AddressIdDTO} from "../models/address/AddressRequest";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {CurrentUser, updateAddressId} from "../stores/user.reducer";
import {accessToken, apiWithToken} from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {setCurrentShippingAddress} from "../stores/address.reducer";
import {Page} from "../models/Page";
import AddressDeliveryInformationAdd from "./address-delivery-information-add";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";

export const AddressDeliveryInformation = ({deliveryInformation}: { deliveryInformation: Page<AddressResponseDTO[]> }) => {

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
            apiWithToken(store.dispatch, refreshToken).get(`/addresses/${addressId}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function (res: AxiosResponse<AddressResponseDTO>): void {
                    dispatch(setCurrentShippingAddress(res.data));
                })
                .catch(function (res): void {
                    notification.open({
                        type: 'error',
                        message: 'Shipping address message',
                        description: res.message
                    });
                });
        }
    };

    const deleteDeliveryInformation = (addressId: string): void => {
        if (refreshToken) {
            apiWithToken(store.dispatch, refreshToken).delete(`/addresses/${addressId}`, {
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
                        message: 'Delivery information message',
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
            apiWithToken(store.dispatch, refreshToken).put("/users/update-address", addressIdDTO, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function (): void {
                    dispatch(updateAddressId(addressId));
                    getShippingAddress();
                    router.push("/account-information");

                    notification.open({
                        type: 'success',
                        message: 'Shipping address message',
                        description: "Update shipping address successfully"
                    });
                })
                .catch(function (res): void {
                    notification.open({
                        type: 'error',
                        message: 'Shipping address message',
                        description: res.message
                    });
                });
        }
    };

    return (
        <div style={{width: '1000px', margin: '0 auto'}}>
            <Button
                style={{margin: '16px 0'}}
                onClick={handleAddAddressClick}>{showAddAddress ? "Cancel" : "Add address"}</Button>
            {showAddAddress && (
                <div style={{width: '600px', margin: '0 auto'}}><AddressDeliveryInformationAdd/></div>
            )}
            {!showAddAddress && (
                <List
                    grid={{gutter: 16, column: 1}}
                    dataSource={deliveryInformation.content}
                    renderItem={(item: AddressResponseDTO) => (
                        <List.Item>
                            <Card>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>
                                        <div>
                                            <span
                                                style={{fontWeight: 'bold', marginRight: '8px'}}>{item.fullName}</span>
                                            <span style={{marginRight: '8px'}}>|</span>
                                            <span style={{marginRight: '8px'}}>{item.phoneNumber}</span>
                                            {(item.id === currentUser.addressId) &&
                                                <span
                                                    style={{color: 'green'}}><CheckCircleOutlined/> Địa chỉ mặc định</span>
                                            }
                                        </div>
                                        <div>{item.address}</div>
                                    </div>
                                    <div>
                                        <Button type="text" style={{color: 'blueviolet'}}
                                                onClick={() => updateShippingAddress(item.id ?? "")}>
                                            Đặt làm mặc định
                                        </Button>
                                        <span style={{marginLeft: '16px'}}><DeleteOutlined
                                            onClick={() => deleteDeliveryInformation(item.id ?? "")}/></span>
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );

};

export default AddressDeliveryInformation;