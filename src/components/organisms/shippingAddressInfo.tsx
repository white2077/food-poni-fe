import { useDispatch, useSelector } from "react-redux";
import { Alert, AutoComplete, Button, Form, Input } from "antd";
import {
  createAddressAction,
  startSearchAddressAction,
  updateAddressAction,
  updateFormEditingSuccess,
  updateFormSavedSuccess,
} from "@/redux/modules/address.ts";
import { RootState } from "@/redux/store.ts";
import { Address, SearchResult } from "@/type/types.ts";
import { useEffect } from "react";
import {checkDirty} from "@/utils/common.ts";

export type FormRule = {
  fullName: string;
  phoneNumber: string;
  address: string;
  lon: number;
  lat: number;
};

export default function ShippingAddressInfo({
  address,
}: {
  address?: Address;
}) {
  const dispatch = useDispatch();
  const { isUpdateLoading, addressesSearched, formEditing, formSaved } =
    useSelector((state: RootState) => state.address);

  useEffect(() => {
    if (address) {
      dispatch(
        updateFormSavedSuccess({
          fields: [
            { field: "fullName", value: address.fullName },
            { field: "phoneNumber", value: address.phoneNumber },
            { field: "address", value: address.address },
            { field: "lon", value: address.lon.toString() },
            { field: "lat", value: address.lat.toString() },
          ],
        }),
      );
      dispatch(
        updateFormEditingSuccess({
          field: "fullName",
          value: address.fullName,
        }),
      );
      dispatch(
        updateFormEditingSuccess({
          field: "phoneNumber",
          value: address.phoneNumber,
        }),
      );
      dispatch(
        updateFormEditingSuccess({ field: "address", value: address.address }),
      );
      dispatch(
        updateFormEditingSuccess({
          field: "lon",
          value: address.lon.toString(),
        }),
      );
      dispatch(
        updateFormEditingSuccess({
          field: "lat",
          value: address.lat.toString(),
        }),
      );
    }
  }, [dispatch]);

  if (address && !formSaved.fields) {
    return null;
  }

  return (
    <Form
      name={
        address && address.id
          ? `update-address-form-${address.id}`
          : "add-address-form"
      }
      className="add-address-form my-[16px]"
      clearOnDestroy={true}
      initialValues={{
        fullName: address && address.fullName,
        phoneNumber: address && address.phoneNumber,
        address: address && address.address,
        lon: address && address.lon.toString(),
        lat: address && address.lat.toString(),
      }}
      onFinish={() =>
        dispatch(
          address
            ? updateAddressAction({ id: address.id })
            : createAddressAction(),
        )
      }
    >
      {/*Full name*/}
      {formEditing.fields[0].errorMessage && (
        <Alert
          className="py-1"
          message={formEditing.fields[0].errorMessage}
          type="error"
          showIcon
        />
      )}
      <Form.Item name="fullName">
        <Input
          placeholder="Họ tên"
          onChange={(e) =>
            dispatch(
              updateFormEditingSuccess({
                type: "TYPING",
                field: "fullName",
                value: e.target.value,
              }),
            )
          }
        />
      </Form.Item>
      {/*Phone number*/}
      {formEditing.fields[1].errorMessage && (
        <Alert
          className="py-1"
          message={formEditing.fields[1].errorMessage}
          type="error"
          showIcon
        />
      )}
      <Form.Item name="phoneNumber">
        <Input
          placeholder="Số điện thoại"
          onChange={(e) =>
            dispatch(
              updateFormEditingSuccess({
                type: "TYPING",
                field: "phoneNumber",
                value: e.target.value,
              }),
            )
          }
        />
      </Form.Item>
      {/*Address*/}
      {formEditing.fields[2].errorMessage && (
        <Alert
          className="py-1"
          message={formEditing.fields[2].errorMessage}
          type="error"
          showIcon
        />
      )}
      {formEditing.fields[3].errorMessage && (
        <Alert
          className="py-1"
          message={formEditing.fields[3].errorMessage}
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
                updateFormEditingSuccess({
                  type: "SELECT",
                  field: "address",
                  value: option.data.display_name,
                }),
              );
              dispatch(
                updateFormEditingSuccess({
                  type: "SELECT",
                  field: "lon",
                  value: option.data.lon + "",
                }),
              );
              dispatch(
                updateFormEditingSuccess({
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
              updateFormEditingSuccess({
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
          loading={isUpdateLoading}
          disabled={formEditing.isDirty || checkDirty(formEditing.fields, formSaved.fields)}
          block
        >
          Lưu địa chỉ
        </Button>
      </Form.Item>
    </Form>
  );
}
