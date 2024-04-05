import {Card, Checkbox, Col, InputNumber, Row} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteItem, ICartItem, setNote, setQuantity} from "../store/cart.reducer";

const OrderCartItems = () => {

    const dispatch = useDispatch();

    const cartItems = useSelector(state => state.cart.cartItems) as ICartItem[];

    const onChangeQuantity = (id: string, value: number) => {
        const payload = {id, value};
        dispatch(setQuantity(payload));
    }

    const onChangeNote = (itemId: string, note: string) => {
        dispatch(setNote({id: itemId, note}));
    };

    return (
        <div>
            <Card style={{marginBottom: "16px"}}>
                <Row>
                    <Col flex='2%'>
                        <Checkbox></Checkbox>
                    </Col>
                    <Col flex='40%'>Tất cả</Col>
                    <Col flex='10%'>Đơn giá</Col>
                    <Col flex='10%'>Số lượng</Col>
                    <Col flex='10%'>Thành tiền</Col>
                    <Col flex='26%'>Ghi chú</Col>
                    <Col flex='2%'>
                        <DeleteOutlined/>
                    </Col>
                </Row>
            </Card>
            <Card>
                {cartItems.map((item, index) => (
                    <Row key={index} style={{margin: '16px 0', alignItems: 'center'}}>
                        <Col flex='2%'>
                            <Checkbox checked></Checkbox>
                        </Col>
                        <Col flex='40%'>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div>
                                    <img src={item.thumbnail} style={{width: "100px"}} alt="Product"/>
                                </div>
                                <div style={{marginLeft: '16px'}}>{item.name}</div>
                            </div>
                        </Col>
                        <Col flex='10%'>${item.price}</Col>
                        <Col flex='10%'>
                            <InputNumber min={1}
                                         max={20}
                                         style={{maxWidth: '70px'}}
                                         defaultValue={1}
                                         value={item.quantity}
                                         onChange={(value: number | null) => onChangeQuantity(item.id, value!)}/>
                        </Col>
                        <Col flex='10%'>${item.price * item.quantity}</Col>
                        <Col flex='26%'>
                            <TextArea
                                placeholder="Note"
                                value={item.note}
                                onChange={(e) => onChangeNote(item.id, e.target.value)}
                                rows={2}
                            />
                        </Col>
                        <Col flex='2%'>
                            <DeleteOutlined id={`delete-icon-${item.id}`} onClick={() => dispatch(deleteItem({id: item.id}))}/>
                        </Col>
                    </Row>
                ))}
            </Card>
        </div>
    )
}

export default OrderCartItems;