import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { useState } from "react";
import { ProductCategoriesForm } from "../molecules/ProductCategoriesForm";

export const ProductCategoriesModalCreate = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Popover
      title="Thêm mới"
      open={isOpen}
      content={
        <div className="w-[600px]">
          <ProductCategoriesForm />
        </div>
      }
      trigger="click"
      placement="bottomRight"
    >
      <Button
        type="primary"
        icon={isOpen ? <CloseOutlined /> : <PlusOutlined />}
        style={{ marginRight: "10px" }}
        onClick={() => setOpen(!isOpen)}
      >
        {isOpen ? "Đóng" : "Thêm mới"}
      </Button>
    </Popover>
  );
};
