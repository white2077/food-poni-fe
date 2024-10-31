import { Checkbox, Col, Popconfirm, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export const CartHeader = ({
  enableCartGroup,
  isAllChecked,
  isDeleteAllLoading,
  isDisableCheckbox,
  updateAllCheckedRequest,
  deleteAllCartRequest,
}: {
  enableCartGroup: boolean;
  isDeleteAllLoading?: boolean;
  isAllChecked?: boolean;
  isDisableCheckbox?: boolean;
  updateAllCheckedRequest?: () => void;
  deleteAllCartRequest?: () => void;
}) => (
  <div className="p-2 bg-white border-[1px] rounded-lg ">
    <Row>
      {!enableCartGroup && (
        <Col flex="2%">
          <Checkbox
            disabled={isDisableCheckbox}
            checked={isAllChecked}
            onClick={updateAllCheckedRequest}
          />
        </Col>
      )}
      <Col flex="40%">Tất cả</Col>
      <Col flex="10%">Đơn giá</Col>
      <Col flex="12%">Số lượng</Col>
      <Col flex="14%">Thành tiền</Col>
      <Col flex="19%">Ghi chú</Col>
      <Col flex="3%" className="text-center">
        {!enableCartGroup && (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa không?"
            onConfirm={deleteAllCartRequest}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ loading: isDeleteAllLoading }}
          >
            <DeleteOutlined className="cursor-pointer " />
          </Popconfirm>
        )}
      </Col>
    </Row>
  </div>
);
