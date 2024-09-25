import {useState} from 'react';
import {AutoComplete, Button, Form, Input, notification} from 'antd';
import axios, {AxiosError, AxiosResponse} from "axios";
import {AddressCreationRequestDTO} from "../models/address/AddressRequest";
import {SearchResult} from "../stores/search-position.reducer";
import {accessToken, apiWithToken} from "../utils/axiosConfig.ts";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {NextRouter, useRouter} from "next/router";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {ErrorAPIResponse} from "../models/ErrorAPIResponse";

const AddressDeliveryInformationAdd = () => {

    const router: NextRouter = useRouter();

    const refreshToken = getCookie(REFRESH_TOKEN);

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
                        display_name: string | null,
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

        const deliveryInfo: AddressCreationRequestDTO = {
            fullName: values.fullname,
            phoneNumber: values.phoneNumber,
            address: selectedAddress?.display_name || "",
            lon: selectedAddress?.lon || 0,
            lat: selectedAddress?.lat || 0
        };

        if (refreshToken) {
            apiWithToken(refreshToken).post("/addresses", deliveryInfo, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function (res: AxiosResponse<AddressAPIResponse>) {
                    setPending(false);
                    router.push('/account-information');
                    notification.open({
                        type: 'success',
                        message: 'Địa chỉ',
                        description: "Thêm địa chỉ thành công!",
                    });
                })
                .catch(function (res: AxiosError<ErrorAPIResponse>) {
                    setPending(false);
                    notification.open({
                        type: 'error',
                        message: 'Địa chỉ',
                        description: res.message,
                    });
                });
        }
    };

    return (
        <Form
            name="normal_add_address"
            className="add-address-form my-[16px]"
            onFinish={onFinish}
        >
            <Form.Item
                name="fullname"
                rules={[{required: true, message: 'Vui lòng nhập họ tên!'}]}>
                <Input placeholder="Họ tên"/>
            </Form.Item>
            <Form.Item
                name="phoneNumber"
                rules={[{required: true, message: 'Vui lòng nhập số điện thoại!'}]}>
                <Input placeholder="Số điện thoại"/>
            </Form.Item>
            <Form.Item
                name="yourAddress"
                rules={[{required: true, message: 'Vui lòng chọn địa chỉ!'}]}>
                <AutoComplete
                    options={dataSource.map((result: SearchResult, index: number) => ({
                        value: result.display_name,
                        label: result.display_name,
                        data: result,
                        key: index
                    }))}
                    onSelect={onSelect}
                    onSearch={onSearch}
                    placeholder="Tìm kiếm địa chỉ tại đây"
                    style={{width: '100%'}}>
                    <Input.Search enterButton/>
                </AutoComplete>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="add-address-form-button" loading={pending} disabled={pending} block>
                    Thêm địa chỉ
                </Button>
            </Form.Item>
        </Form>
    );

};

export default AddressDeliveryInformationAdd;