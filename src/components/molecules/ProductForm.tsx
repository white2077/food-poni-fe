import { fetchProductCategoriesRequest } from "@/redux/modules/productCategory";
import { fetchToppingsAction } from "@/redux/modules/topping";
import { RootState } from "@/redux/store";
import { Product } from "@/type/types";
import { checkProductSlugIsExisted } from "@/utils/api/product";
import { currencyFormat, toSlug } from "@/utils/common";
import { PlusOutlined } from "@ant-design/icons";
import MinusCircleOutlined from "@ant-design/icons/lib/icons/MinusCircleOutlined";
import { Button, Form, Input, Popconfirm, Select, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScrollPane } from "../atoms/ScrollPane";
import { ImageSelector } from "./ImageSelector";

const validateMessages = {
  required: "${label} is required!",
  types: {
    slug: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

let timeout: NodeJS.Timeout | null = null;
export const ProductForm = ({ product }: { product?: Product }) => {
  const dispatch = useDispatch();
  const {
    page: productCategoryPage,
    isFetchLoading: isProductCategoryFetchLoading,
  } = useSelector((state: RootState) => state.productCategory);
  const { page: toppingPage, isFetchLoading: isToppingFetchLoading } =
    useSelector((state: RootState) => state.topping);

  const [error, setError] = useState<boolean | null>(true);

  useEffect(() => {
    dispatch(fetchProductCategoriesRequest());
    dispatch(fetchToppingsAction({ queryParams: {} }));
  }, [dispatch]);

  const [form] = useForm<{
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    productCategories: string[];
    toppings: string[];
    thumbnail: string;
    type: string;
    status: boolean;
  }>();

  return (
    <Form
      form={form}
      onFinish={(value) => {
        console.log(value);
        form.resetFields();
      }}
      validateMessages={validateMessages}
      layout="vertical"
      initialValues={
        product && {
          ...product,
          productCategories: product.productCategories.map((item) => item.id),
          toppings: product.toppings.map((item) => item.id),
        }
      }
    >
      <div className="flex gap-8">
        <Form.Item name="id" label="ID" hidden={true}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="thumbnail" label="Thumbnail">
          <ImageSelector
            className="w-[120px] h-[120px]"
            value={form.getFieldValue("thumbnail")}
            onOke={(value) => form.setFieldsValue({ thumbnail: value })}
          />
        </Form.Item>
        <div className="w-full">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input
              onChange={(e) => {
                form.setFieldsValue({
                  slug: toSlug(e.target.value),
                });
                form.validateFields();
              }}
            />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            hasFeedback
            validateStatus={
              error === null ? "validating" : error ? "error" : "success"
            }
            rules={[
              { required: true },
              () => ({
                async validator(_, value) {
                  if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                  }

                  if (value && (error || error === null)) {
                    await new Promise((resolve) => {
                      timeout = setTimeout(() => resolve(0), 500);
                    });

                    setError(null);
                    try {
                      const res = await checkProductSlugIsExisted({
                        slug: value,
                      });
                      if (res) {
                        setError(true);
                        return Promise.reject("Slug is existed");
                      } else {
                        setError(false);
                      }
                    } catch (e) {
                      setError(true);
                      return Promise.reject(e.message);
                    }
                  } else {
                    setError(true);
                  }
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
        </div>
      </div>
      <Form.Item name="shortDescription" label="Short Description">
        <Input.TextArea showCount maxLength={500} />
      </Form.Item>
      <Form.Item name="productCategories" label="Product Categories">
        {isProductCategoryFetchLoading ? (
          <Spin />
        ) : (
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            loading={isProductCategoryFetchLoading}
            options={productCategoryPage.content.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        )}
      </Form.Item>
      <Form.Item name="toppings" label="Toppings">
        {isToppingFetchLoading ? (
          <Spin />
        ) : (
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            options={toppingPage.content.map((item) => ({
              value: item.id,
              label: `${item.name}: ${currencyFormat(item.price)}`,
            }))}
          />
        )}
      </Form.Item>
      <Form.List name="types">
        {(fields, { add, remove }) => (
          <>
            <Form.Item label="Types" required={false}>
              <ScrollPane maxHeight="max-h-[200px]">
                <div className="grid grid-cols-3 gap-4">
                  {fields.map((field) => (
                    <div key={field.key} className="relative">
                      <Form.Item
                        {...field}
                        name={[field.name]}
                        rules={[
                          { required: true },
                          ({ getFieldValue }) => ({
                            validator() {
                              const values = getFieldValue(
                                "types"
                              ) as Array<string>;
                              const uniqueValues = new Set(values);
                              if (uniqueValues.size === values.length) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error("Type must be unique!")
                              );
                            },
                          }),
                        ]}
                      >
                        <Input placeholder="Đáy mỏng" />
                      </Form.Item>
                      <MinusCircleOutlined
                        className="absolute top-2 right-2 dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    </div>
                  ))}
                </div>
              </ScrollPane>
            </Form.Item>
            <Form.Item className="w-full">
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add Type
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item className="mb-0 text-end">
        <Popconfirm title="Are you sure to save?" onConfirm={form.submit}>
          <Button type="primary">Save</Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
