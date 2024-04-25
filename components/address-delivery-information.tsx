import {Button, Card, List, notification} from "antd";
import AddressAdd from "./address-add";
import {CheckCircleOutlined, DeleteOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {NextRouter, useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {setCurrentShippingAddress} from "../store/address.reducer";
import {deleteDeliveryInformationList} from "../store/delivery.reducer";
import {updateAddressId} from "../store/user.reducer";
import {CurrentUser} from "../pages/login";
import {AddressIdDTO} from "../model/address/AddressRequest";
import {AddressResponseDTO} from "../model/address/AddressResponseAPI";

export const AddressDeliveryInformation = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser) as CurrentUser;

    const [showAddAddress, setShowAddAddress] = useState<boolean>(false);

    const deliveryInformationList: AddressResponseDTO[] = useSelector((state: RootState) => state.delivery.deliveryInformationList) as AddressResponseDTO[];

    const handleAddAddressClick = (): void => {
        setShowAddAddress(!showAddAddress);
    };

    const getShippingAddress = (): void => {
        const addressId = currentUser.addressId;

        axiosConfig.get(`/addresses/${addressId}`, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
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
    };

    const deleteDeliveryInformation = (addressId: string): void => {
        axiosConfig.delete(`/addresses/${addressId}`, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (): void {
                dispatch(deleteDeliveryInformationList(addressId));
            })
            .catch(function (res): void {
                notification.open({
                    type: 'error',
                    message: 'Delivery information message',
                    description: res.message
                });
            })
    };

    const updateShippingAddress = (addressId: string): void => {
        const addressIdDTO: AddressIdDTO = {
            id: addressId
        };

        axiosConfig.put("/users/update-address", addressIdDTO, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (): void {
                dispatch(updateAddressId(addressId));

                getShippingAddress();

                notification.open({
                    type: 'success',
                    message: 'Shipping address message',
                    description: "Update shipping address successfully"
                });

                router.push("/account-information")
            })
            .catch(function (res): void {
                notification.open({
                    type: 'error',
                    message: 'Shipping address message',
                    description: res.message
                });
            });
    };

    return (
        <div style={{width: '1000px', margin: '0 auto'}}>
            <Button
                style={{margin: '16px 0'}}
                onClick={handleAddAddressClick}>{showAddAddress ? "Cancel" : "Add address"}</Button>
            {showAddAddress && (
                <div style={{width: '600px', margin: '0 auto'}}><AddressAdd/></div>
            )}
            {!showAddAddress && (
                <List
                    grid={{gutter: 16, column: 1}}
                    dataSource={deliveryInformationList}
                    renderItem={(item: AddressResponseDTO) => (
                        <List.Item>
                            <Card>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <div>
                                        <div>
                                            <span style={{fontWeight: 'bold', marginRight: '8px'}}>{item.fullName}</span>
                                            <span style={{marginRight: '8px'}}>|</span>
                                            <span style={{marginRight: '8px'}}>{item.phoneNumber}</span>
                                            {(item.id === currentUser.addressId) &&
                                                <span style={{color: 'green'}}><CheckCircleOutlined /> Địa chỉ mặc định</span>
                                            }
                                        </div>
                                        <div>{item.address}</div>
                                    </div>
                                    <div>
                                        <Button type="text" style={{color: 'blueviolet'}} onClick={() => updateShippingAddress(item.id ?? "")}>
                                            Đặt làm mặc định
                                        </Button>
                                        <span style={{marginLeft: '16px'}}><DeleteOutlined onClick={() => deleteDeliveryInformation(item.id ?? "")} /></span>
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