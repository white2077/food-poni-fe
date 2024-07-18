import {Card, Checkbox, Col, Divider, Input, InputNumber, Popconfirm, Row} from "antd";
import {DeleteOutlined, RightOutlined} from "@ant-design/icons";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button} from 'antd';
import {PlusOutlined, MinusOutlined} from '@ant-design/icons';
import {
    deleteItem,
    deleteSelectedSoldItems,
    ICart,
    ICartItem,
    setNote,
    setQuantity,
    setSelectedAll,
    setSelectedICart,
    setSelectedICartItem
} from "../stores/cart.reducer";
import {RootState} from "../stores";
import QuantityInput from "./quantityInput";

const {TextArea} = Input;

const OrderItems = () => {

    const dispatch = useDispatch();

    const carts: ICart[] = useSelector((state: RootState) => state.cart.carts);

    const onChangeQuantity = (id: string, retailerId: string, value: number): void => {
        const payload: { id: string, retailerId: string, value: number } = {id, retailerId, value};
        dispatch(setQuantity(payload));
    };

    const onChangeNote = (itemId: string, retailerId: string, note: string): void => {
        dispatch(setNote({id: itemId, retailerId, note}));
    };

    const handleSetSelectedICartItem = (id: string): void => {
        dispatch(setSelectedICartItem(id));
    }

    const handleSetSelectedICart = (id: string): void => {
        dispatch(setSelectedICart(id));
    }

    const handleSetSelectedAll = (): void => {
        dispatch(setSelectedAll());
    }

    const handleDeleteSelectedAll = (): void => {
        dispatch(deleteSelectedSoldItems());
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
                            <DeleteOutlined className="cursor-pointer "/>
                        </Popconfirm>
                    </Col>
                </Row>
            </div>
            {
                carts.length > 0 ? (
                    carts.filter(cart => cart.cartItems.length != 0).map((cart: ICart) => (
                        <div key={cart.id} className="p-2 bg-white border-[1px] rounded-lg mt-4">
                            <Row>
                                <Checkbox onClick={() => handleSetSelectedICart(cart.id)}
                                          checked={cart.isSelectedICart}></Checkbox>
                                <div className="font-bold text-xl mx-2">{cart.name}</div>
                                <RightOutlined/>

                            </Row>
                            <Divider/>
                            {cart.cartItems.map((item: ICartItem, index: number) => (
                                <Row key={index} className="my-[16px] items-center">
                                    <Col flex='2%'>
                                        <Checkbox onClick={() => handleSetSelectedICartItem(item.id)}
                                                  checked={item.isSelectedICartItem}></Checkbox>
                                    </Col>
                                    <Col flex='40%'>
                                        <div className="flex items-center">
                                            <div>
                                                <img src={item.thumbnail} className="w-[100px] rounded-lg ml-2"
                                                     alt="Product"/>
                                            </div>
                                            <div className="ml-[16px]">{item.name}</div>
                                        </div>
                                    </Col>
                                    <Col flex='9%' className="font-bold"> ${item.price}</Col>
                                    <Col flex='13%'>
                                        <QuantityInput item={item} onChangeQuantity={onChangeQuantity}/>
                                    </Col>
                                    <Col flex='14%'
                                         className="font-bold text-red-500">${item.price * item.quantity}</Col>
                                    <Col flex='19%'>
                                        <TextArea
                                            placeholder="Ghi chú"
                                            value={item.note}
                                            className="h-[35px]"
                                            onChange={(e) => onChangeNote(item.id, item.retailer.id ?? '', e.target.value)}
                                            allowClear
                                        />
                                    </Col>
                                    <Col flex='3%' className="text-center">
                                        <DeleteOutlined id={`delete-icon-${item.id}`}
                                                        onClick={() => dispatch(deleteItem({
                                                            id: item.id,
                                                            retailerId: item.retailer.id ?? ''
                                                        }))}/>
                                    </Col>
                                </Row>
                            ))}
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