import {Card, Checkbox, Col, Input, Popconfirm, Row} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {Cart} from "@/type/types.ts";
import {QuantityInput} from "@/components/molecules/quantityInput.tsx";
import {deleteCartRequest} from "@/redux/modules/cart.ts";
import {server} from "@/utils/server.ts";

const { TextArea } = Input;

const OrderItems = () => {

    const dispatch = useDispatch();

    const carts = useSelector((state: RootState) => state.cart.data);

    const handleSetSelectedICartItem = (id: string): void => {
        // dispatch(setSelectedICartItem(id));
    }

    const handleSetSelectedICart = (id: string): void => {
        // dispatch(setSelectedICart(id));
    }

    const handleSetSelectedAll = (): void => {
        // dispatch(setSelectedAll());
    }

    const handleDeleteSelectedAll = (): void => {
        // dispatch(deleteSelectedSoldItems());
    };

    return (
        <div>

            <div className="p-2 bg-white border-[1px] rounded-lg ">
                <Row>
                    <Col flex='2%'>
                        <Checkbox onClick={handleSetSelectedAll}></Checkbox>
                    </Col>
                    <Col flex='40%'>Tất cả</Col>
                    <Col flex='10%'>Đơn giá</Col>
                    <Col flex='12%'>Số lượng</Col>
                    <Col flex='14%'>Thành tiền</Col>
                    <Col flex='19%'>Ghi chú</Col>
                    <Col flex='3%' className="text-center">
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa không?"
                            onConfirm={handleDeleteSelectedAll}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined className="cursor-pointer " />
                        </Popconfirm>
                    </Col>
                </Row>
            </div>
            {
                carts.page.content.length > 0 ? (
                    carts.page.content.map((cart: Cart) => (
                        <div key={cart.id} className="p-2 bg-white border-[1px] rounded-lg mt-4">
                            <Row className="my-[16px] items-center">
                                <Col flex='2%'>
                                    <Checkbox onClick={() => handleSetSelectedICartItem(cart.id)}
                                              checked={cart.checked}></Checkbox>
                                </Col>
                                <Col flex='40%'>
                                    <div className="flex items-center">
                                        <div>
                                            <img src={server + cart.productDetail.images[0]} className="w-[100px] rounded-lg ml-2"
                                                 alt="Product" />
                                        </div>
                                        <div className="ml-[16px]">{cart.productName}</div>
                                    </div>
                                </Col>
                                <Col flex='9%' className="font-bold">
                                    {cart.productDetail.price}
                                    <sup>₫</sup>
                                </Col>
                                <Col flex='13%'>
                                    <QuantityInput item={cart} />
                                </Col>
                                <Col flex='14%'
                                     className="font-bold text-red-500">
                                    {cart.productDetail.price * cart.quantity}
                                    <sup>₫</sup>
                                </Col>
                                <Col flex='19%'>
                                    <TextArea
                                        placeholder="Ghi chú"
                                        // value={cart.note}
                                        className="h-[35px]"
                                        // onChange={(e) => onChangeNote(item.id, item.retailer.id ?? '', e.target.value)}
                                        allowClear
                                    />
                                </Col>
                                <Col flex='3%' className="text-center">
                                    <DeleteOutlined id={`delete-icon-${cart.id}`}
                                                    onClick={() => dispatch(deleteCartRequest(cart.id))}
                                    />
                                </Col>
                            </Row>
                        </div>
                    ))
                ) : (
                    <Card className="my-2">
                        <div className="text-center font-bold">Chưa có sản phẩm nào!</div>
                    </Card>
                )
            }
        </div>
    );

};

export default OrderItems;