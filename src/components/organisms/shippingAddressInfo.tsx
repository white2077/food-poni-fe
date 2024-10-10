import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { SearchResult } from "@/redux/modules/searchPosition.ts";
import axios, { AxiosResponse } from "axios";
import { AutoComplete, Button, Form, Input } from "antd";
import { RootState } from "@/redux/store.ts";
import { createAddressRequest } from "@/redux/modules/address.ts";

export default function ShippingAddressInfo() {
  const dispatch = useDispatch();

  const [dataSource, setDataSource] = useState<SearchResult[]>([]);

  const { isCreateLoading } = useSelector((state: RootState) => state.address);

  let timeout: NodeJS.Timeout | null = null;

  const delayedSearch = (value: string): void => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout((): void => {
      axios
        .get<SearchResult[]>(
          `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`,
        )
        .then((response: AxiosResponse<SearchResult[]>): void => {
          const results: {
            display_name: string | null;
            lon: number;
            lat: number;
          }[] = response.data.map((item: SearchResult) => ({
            display_name: item.display_name,
            lon: item.lon,
            lat: item.lat,
          }));

          setDataSource(results);
        })
        .catch((error): void => {
          console.error(error);
        });
    }, 500);
  };

  return (
    <Form
      name="normal_add_address"
      className="add-address-form my-[16px]"
      onFinish={(values) => {
        dispatch(
          createAddressRequest({
            fullName: values.fullname,
            phoneNumber: values.phoneNumber,
            address: values.address,
            lon: dataSource[0].lon,
            lat: dataSource[0].lat,
          }),
        );
      }}
    >
      <Form.Item
        name="fullname"
        rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
      >
        <Input placeholder="Họ tên" />
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
      >
        <Input placeholder="Số điện thoại" />
      </Form.Item>
      <Form.Item
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
      >
        <AutoComplete
          options={dataSource.map((result: SearchResult, index: number) => ({
            value: result.display_name,
            label: result.display_name,
            data: result,
            key: index,
          }))}
          // onSelect={(value: string, option: { data: SearchResult }): void => {
          //     dispatch(updateAddress(option.data));
          // }}
          onSearch={(value: string): void => delayedSearch(value)}
          placeholder="Tìm kiếm địa chỉ tại đây"
          style={{ width: "100%" }}
        >
          <Input.Search enterButton />
        </AutoComplete>
      </Form.Item>
      {/*<Form.Item*/}
      {/*    name="note"*/}
      {/*    rules={[{ required: true, message: 'Vui lòng nhập ghi chú!' }]}>*/}
      {/*    <Input placeholder="Ghi chú" />*/}
      {/*</Form.Item>*/}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="add-address-form-button"
          loading={isCreateLoading}
          disabled={isCreateLoading}
          block
        >
          Thêm địa chỉ
        </Button>
      </Form.Item>
    </Form>
  );
}
