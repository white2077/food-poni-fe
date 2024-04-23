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

export const PersonalInformation = () => {

    return (
        <div>Personal information</div>
    )

}

export default PersonalInformation;