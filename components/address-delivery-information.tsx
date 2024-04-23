import {Button, Card, List, notification} from "antd";
import AddressAdd from "./address-add";
import {CheckCircleOutlined, DeleteOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {CurrentUser} from "../model/User";
import {DeliveryInformation} from "../model/DeliveryInformation";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {Address, AddressIdDTO} from "../model/Address";
import {setCurrentShippingAddress} from "../store/address.reducer";
import {deleteDeliveryInformationList} from "../store/delivery.reducer";
import {updateAddressId} from "../store/user.reducer";

export const AddressDeliveryInformation = () => {

    const router = useRouter();

    const dispatch = useDispatch();

    const currentUser = useSelector((state: RootState) => state.user.currentUser) as CurrentUser;

    const [showAddAddress, setShowAddAddress] = useState(false);

    const deliveryInformationList = useSelector((state: RootState) => state.delivery.deliveryInformationList) as DeliveryInformation[];

    const handleAddAddressClick = () => {
        setShowAddAddress(!showAddAddress)
    }

    const getShippingAddress = () => {
        const addressId = currentUser.addressId;

        axiosConfig.get(`/addresses/${addressId}`, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<Address>) {
                dispatch(setCurrentShippingAddress(res.data));
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Shipping address message',
                    description: res.message
                });
            })
    }

    const deleteDeliveryInformation = (addressId: string) => {
        axiosConfig.delete(`/addresses/${addressId}`, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function () {
                dispatch(deleteDeliveryInformationList(addressId));
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Delivery information message',
                    description: res.message
                });
            })
    }

    const updateShippingAddress = (addressId: string) => {
        const addressIdDTO: AddressIdDTO = {
            id: addressId
        }

        axiosConfig.put("/users/update-address", addressIdDTO, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function () {
                dispatch(updateAddressId(addressId));

                getShippingAddress();

                notification.open({
                    type: 'success',
                    message: 'Shipping address message',
                    description: "Update shipping address successfully"
                });

                router.push("/account-information")
            })
            .catch(function (res) {
                notification.open({
                    type: 'error',
                    message: 'Shipping address message',
                    description: res.message
                });
            })
    }

    return (
        <div>
            <Button
                style={{margin: '16px 0'}}
                onClick={handleAddAddressClick}>{showAddAddress ? "Cancel" : "Add address"}</Button>
            {showAddAddress && <AddressAdd/>}
            {!showAddAddress && (
                <List
                    grid={{gutter: 16, column: 1}}
                    dataSource={deliveryInformationList}
                    renderItem={(item: DeliveryInformation, index: number) => (
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
                                        <Button type="text" style={{color: 'blueviolet'}} onClick={() => updateShippingAddress(item.id)}>
                                            Đặt làm mặc định
                                        </Button>
                                        <span style={{marginLeft: '16px'}}><DeleteOutlined onClick={() => deleteDeliveryInformation(item.id)} /></span>
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            )}
        </div>
    )

}

export default AddressDeliveryInformation;