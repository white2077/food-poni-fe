import { Button, Form, Input, InputNumber } from "antd";

const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };

export const ProductForm = () => {
  return (
    <Form
      name="nest-messages"
      onFinish={() => {}}
      validateMessages={validateMessages}
    >
      <Form.Item
        name={["user", "name"]}
        label="Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "email"]}
        label="Email"
        rules={[{ type: "email" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "age"]}
        label="Age"
        rules={[{ type: "number", min: 0, max: 99 }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item name={["user", "website"]} label="Website">
        <Input />
      </Form.Item>
      <Form.Item name={["user", "introduction"]} label="Introduction">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
