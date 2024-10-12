import { useDispatch, useSelector } from "react-redux";
import { Alert, AutoComplete, Button, Form, Input } from "antd";
import {
  createAddressAction,
  startSearchAddressAction,
  updateFormSuccess,
} from "@/redux/modules/address.ts";
import { RootState } from "@/redux/store.ts";
import { SearchResult } from "@/type/types.ts";

export type FormRule = {
  fullName: string;
  phoneNumber: string;
  address: string;
  lon: number;
  lat: number;
};

export default function ShippingAddressInfo() {
  const dispatch = useDispatch();
  const { isCreateLoading, addressesSearched, form } = useSelector(
    (state: RootState) => state.address,
  );

  return (
    <Form
      name="normal_add_address"
      className="add-address-form my-[16px]"
      onFinish={() => dispatch(createAddressAction())}
    >
      {form.fields[0].errorMessage && (
        <Alert
          className="py-1"
          message={form.fields[0].errorMessage}
          type="error"
          showIcon
        />
      )}
      <Form.Item name="fullname">
        <Input
          placeholder="Họ tên"
          onChange={(e) =>
            dispatch(
              updateFormSuccess({
                type: "TYPING",
                field: "fullName",
                value: e.target.value,
              }),
            )
          }
        />
      </Form.Item>
      {form.fields[1].errorMessage && (
        <Alert
          className="py-1"
          message={form.fields[1].errorMessage}
          type="error"
          showIcon
        />
      )}
      <Form.Item name="phoneNumber">
        <Input
          placeholder="Số điện thoại"
          onChange={(e) =>
            dispatch(
              updateFormSuccess({
                type: "TYPING",
                field: "phoneNumber",
                value: e.target.value,
              }),
            )
          }
        />
      </Form.Item>
      {form.fields[2].errorMessage && (
        <Alert
          className="py-1"
          message={form.fields[2].errorMessage}
          type="error"
          showIcon
        />
      )}
      {form.fields[3].errorMessage && (
        <Alert
          className="py-1"
          message={form.fields[3].errorMessage}
          type="error"
          showIcon
        />
      )}
      <Form.Item name="address">
        <AutoComplete
          options={addressesSearched.map(
            (result: SearchResult, index: number) => ({
              value: result.display_name,
              label: result.display_name,
              data: result,
              key: index,
            }),
          )}
          onSelect={(_: string, option: { data: SearchResult }): void => {
            if (option.data.display_name) {
              dispatch(
                updateFormSuccess({
                  type: "SELECT",
                  field: "address",
                  value: option.data.display_name,
                }),
              );
              dispatch(
                updateFormSuccess({
                  type: "SELECT",
                  field: "lon",
                  value: option.data.lon + "",
                }),
              );
              dispatch(
                updateFormSuccess({
                  type: "SELECT",
                  field: "lat",
                  value: option.data.lat + "",
                }),
              );
            }
          }}
          onSearch={(value: string): void => {
            dispatch(startSearchAddressAction({ value }));
            dispatch(
              updateFormSuccess({
                type: "TYPING",
                field: "address",
                value: value,
              }),
            );
          }}
          placeholder="Tìm kiếm địa chỉ tại đây"
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="add-address-form-button"
          loading={isCreateLoading}
          disabled={form.isDirty}
          block
        >
          Thêm địa chỉ
        </Button>
      </Form.Item>
    </Form>
  );
}
