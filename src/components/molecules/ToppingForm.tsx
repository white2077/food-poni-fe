import {
  createToppingAction,
  updateToppingAction,
} from "@/redux/modules/topping";
import { RootState } from "@/redux/store";
import { Topping } from "@/type/types";
import { Button, Form, Input, InputNumber, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const validateMessages = {
  required: "${label} is required!",
  types: {
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export type ToppingFormState = {
  id: string;
  name: string;
  price: number;
};

export const ToppingForm = ({ topping }: { topping?: Topping }) => {
  const dispatch = useDispatch();
  const { isCreateLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.topping
  );
  const [form] = useForm<ToppingFormState>();

  useEffect(() => {
    if (topping) {
      form.setFieldsValue({
        ...topping
      });
    }
  }, [topping, form]);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        dispatch(
          values.id
            ? updateToppingAction({
                topping: values,
                resetForm: () => form.resetFields(),
              })
            : createToppingAction({
                topping: values,
                resetForm: () => form.resetFields(),
              })
        );
      }}
      validateMessages={validateMessages}
      layout="vertical"
    >
      <Form.Item name="id" hidden noStyle/>
      <div className="w-full">
        <Form.Item name="name" label="Tên topping" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </div>
      <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
        <InputNumber
          className="w-full"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => value!.replace(/\./g, "")}
        />
      </Form.Item>
      <Form.Item className="mb-0 text-end">
        <Popconfirm title="Bạn có muốn lưu?" onConfirm={form.submit}>
          <Button loading={isCreateLoading || isUpdateLoading} type="primary">
            Lưu
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
