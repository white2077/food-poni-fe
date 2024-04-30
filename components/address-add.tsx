import {useState} from 'react';
import {AutoComplete, Button, Form, Input, notification} from 'antd';
import axios, {AxiosResponse} from "axios";
import axiosConfig from "../utils/axios-config";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {addDeliveryInformationList} from "../stores/delivery.reducer";
import {AddressRequestDTO} from "../models/address/AddressRequest";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {CurrentUser} from "../stores/user.reducer";

export interface SearchResult {
    display_name: string;
    lon: number;
    lat: number;
}

const AddressAdd = () => {

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [pending, setPending] = useState<boolean>(false);

    const [dataSource, setDataSource] = useState<SearchResult[]>([]);

    const [selectedAddress, setSelectedAddress] = useState<SearchResult | null>(null);

    let timeout: NodeJS.Timeout | null = null;

    const delayedSearch = (value: string): void => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout((): void => {
            axios
                .get<SearchResult[]>(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`)
                .then((response: AxiosResponse<SearchResult[]>): void => {
                    const results: {
                        display_name: string,
                        lon: number,
                        lat: number
                    }[] = response.data.map((item: SearchResult) => ({
                        display_name: item.display_name,
                        lon: item.lon,
                        lat: item.lat
                    }));

                    setDataSource(results);
                })
                .catch((error): void => {
                    console.error(error);
                });
        }, 500);
    };

    const onSearch = (value: string): void => {
        delayedSearch(value);
    };

    const onSelect = (value: string, option: { data: SearchResult }): void => {
        // console.log('onSelect', value);
        // console.log('Selected Option:', option.data);

        setSelectedAddress(option.data);
    };

    const onFinish = (values: any): void => {
        setPending(true);

        const deliveryInfo: AddressRequestDTO = {
            fullName: values.fullname,
            phoneNumber: values.phoneNumber,
            address: selectedAddress?.display_name || "",
            lon: selectedAddress?.lon || 0,
            lat: selectedAddress?.lat || 0
        };

        axiosConfig.post("/addresses", deliveryInfo, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<AddressResponseDTO>) {
                setPending(false);

                dispatch(addDeliveryInformationList(res.data));

                notification.open({
                    type: 'success',
                    message: 'Add address message',
                    description: "Add new address successfully!",
                });
            })
            .catch(function (res) {
                setPending(false);
                notification.open({
                    type: 'error',
                    message: 'Add address message',
                    description: res.message,
                });
            });
    };

    return (
        <Form
            name="normal_add_address"
            className="add-address-form"
            onFinish={onFinish}
            style={{margin: '16px 0'}}
        >
            <Form.Item
                name="fullname"
                rules={[{required: true, message: 'Please input your fullname!'}]}>
                <Input placeholder="Fullname"/>
            </Form.Item>
            <Form.Item
                name="phoneNumber"
                rules={[{required: true, message: 'Please input your phone number!'}]}>
                <Input placeholder="Phone number"/>
            </Form.Item>
            <Form.Item
                name="yourAddress"
                rules={[{required: true, message: 'Please choose your address!'}]}>
                <AutoComplete
                    options={dataSource.map((result: SearchResult) => ({
                        value: result.display_name,
                        label: result.display_name,
                        data: result
                    }))}
                    onSelect={onSelect}
                    onSearch={onSearch}
                    placeholder="input search text"
                    style={{width: '100%'}}>
                    <Input.Search enterButton/>
                </AutoComplete>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="add-address-form-button" loading={pending}
                        block>
                    Add address
                </Button>
            </Form.Item>
        </Form>
    );

};

export default AddressAdd;