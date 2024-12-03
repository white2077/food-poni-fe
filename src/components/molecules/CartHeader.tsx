import { Checkbox, Col, Popconfirm, Row, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export const CartHeader = ({
  enableCartGroup,
  enableDeleteAll,
  isAllChecked,
  isDeleteAllLoading,
  isCheckAllLoading,
  isDisableCheckbox,
  updateAllCheckedRequest,
  deleteAllCartRequest,
}: {
  enableCartGroup: boolean;
  enableDeleteAll?: boolean;
  isDeleteAllLoading?: boolean;
  isCheckAllLoading?: boolean;
  isAllChecked?: boolean;
  isDisableCheckbox?: boolean;
  updateAllCheckedRequest?: () => void;
  deleteAllCartRequest?: () => void;
}) => (
  <div className="p-2 bg-white border-[1px] rounded-lg ">
    <Row>
      {!enableCartGroup && (
        <Col flex="3%">
          {isCheckAllLoading ? (
            <Spin size="small" />
          ) : (
            <Checkbox
              disabled={isDisableCheckbox}
              checked={isAllChecked}
              onClick={updateAllCheckedRequest}
            />
          )}
        </Col>
      )}
      <Col flex="40%">Tất cả</Col>
      <Col flex="10%">Đơn giá</Col>
      <Col flex="12%">Số lượng</Col>
      <Col flex="14%">Thành tiền</Col>
      <Col flex="18%">Ghi chú</Col>
      <Col flex="3%" className="text-center">
        {!enableCartGroup && enableDeleteAll && (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa không?"
            onConfirm={deleteAllCartRequest}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            {isDeleteAllLoading ? (
              <Spin size="small" />
            ) : (
              <DeleteOutlined className="cursor-pointer " />
            )}
          </Popconfirm>
        )}
      </Col>
    </Row>
  </div>
);
