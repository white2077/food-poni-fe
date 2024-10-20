import { Card, Checkbox, Col, Input, Popconfirm, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store.ts";
import { QuantityInput } from "@/components/molecules/quantityInput.tsx";
import {
  deleteAllCartRequest,
  deleteCartRequest,
  updateAllCheckedRequest,
  updateCheckedAction,
} from "@/redux/modules/cart.ts";
import { ProductLoading } from "@/components/atoms/productLoading.tsx";
import { currencyFormat, getThumbnail } from "@/utils/common.ts";

const { TextArea } = Input;

export default function OrderItems() {
  const dispatch = useDispatch();

  const { page, isFetchLoading, isAllChecked, isDeleteAllLoading } =
    useSelector((state: RootState) => state.cart);

  return (
    <div>
      <div className="p-2 bg-white border-[1px] rounded-lg ">
        <Row>
          <Col flex="2%">
            <Checkbox
              disabled={page.content.length === 0}
              checked={page.content.length !== 0 ? isAllChecked : false}
              onClick={() => dispatch(updateAllCheckedRequest())}
            />
          </Col>
          <Col flex="40%">Tất cả</Col>
          <Col flex="10%">Đơn giá</Col>
          <Col flex="12%">Số lượng</Col>
          <Col flex="14%">Thành tiền</Col>
          <Col flex="19%">Ghi chú</Col>
          <Col flex="3%" className="text-center">
            {page.content.length > 0 && (
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa không?"
                onConfirm={() => dispatch(deleteAllCartRequest())}
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
      {isFetchLoading ? (
        <ProductLoading />
      ) : page.content.length > 0 ? (
        page.content.map((it, index) => (
          <div
            key={index}
            className="p-2 bg-white border-[1px] rounded-lg mt-4"
          >
            <Row className="my-[16px] items-center">
              <Col flex="2%">
                <Checkbox
                  onClick={() =>
                    dispatch(
                      updateCheckedAction({
                        id: it.id,
                        checked: !it.checked,
                      }),
                    )
                  }
                  checked={it.checked}
                />
              </Col>
              <Col flex="40%">
                <div className="flex items-center">
                  <div>
                    <img
                      src={getThumbnail(it.productDetail.images[0])}
                      className="w-[100px] rounded-lg ml-2"
                      alt="Product"
                    />
                  </div>
                  <div className="ml-[16px] max-w-[200px]">
                    {it.productName}
                    {it.type && (
                      <div className="text-[10px]">
                        Loại:{" "}
                        <span className="bg-primary text-white rounded-lg mr-1 px-1">
                          {it.type}
                        </span>
                      </div>
                    )}
                    {it.toppings.length > 0 && (
                      <div className="text-[10px]">
                        <div>Topping:</div>
                        {it.toppings.map((tp, index) => {
                          return (
                            <div
                              key={index}
                              className="inline-block bg-primary text-white rounded-lg mr-1 px-1 mb-1"
                            >{`${tp.name}: ${tp.price}₫`}</div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Col>
              <Col flex="9%" className="font-bold">
                {currencyFormat(it.productDetail.price)}
              </Col>
              <Col flex="13%">
                <QuantityInput item={it} />
              </Col>
              <Col flex="14%" className="font-bold text-red-500">
                {currencyFormat(
                  (it.productDetail.price +
                    it.toppings.reduce((sum, tp) => sum + tp.price, 0)) *
                    it.quantity,
                )}
              </Col>
              <Col flex="19%">
                <TextArea
                  placeholder="Ghi chú"
                  // value={cart.note}
                  className="h-[35px]"
                  // onChange={(e) => onChangeNote(item.id, item.retailer.id ?? '', e.target.value)}
                  allowClear
                />
              </Col>
              <Col flex="3%" className="text-center">
                <Popconfirm
                  title="Bạn có chắc chắn muốn xóa không?"
                  onConfirm={() => dispatch(deleteCartRequest({ id: it.id }))}
                  okText="Đồng ý"
                  cancelText="Hủy"
                  okButtonProps={{ loading: it.isDeleteLoading }}
                >
                  <DeleteOutlined />
                </Popconfirm>
              </Col>
            </Row>
          </div>
        ))
      ) : (
        <Card className="my-2">
          <div className="text-center font-bold">Chưa có sản phẩm nào!</div>
        </Card>
      )}
    </div>
  );
}
