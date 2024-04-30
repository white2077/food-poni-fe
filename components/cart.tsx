import React, {useState} from "react";
import {Avatar, Badge, Drawer, InputNumber, List} from 'antd';
import {CloseOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {deleteItem, ICartItem, setQuantity} from "../stores/cart.reducer";
import {RootState} from "../stores";


const Cart = () => {

    const dispatch = useDispatch();

    const [open, setOpen] = useState<boolean>(false);

    const cartItems: ICartItem[] = useSelector((state: RootState) => state.cart.cartItems) as ICartItem[];

    const showDrawer = (): void => {
        setOpen(true);
    };

    const onClose = (): void => {
        setOpen(false);
    };

    const onChangeQuantity = (id: string, value: number): void => {
        const payload: {id: string, value: number} = {id, value};
        dispatch(setQuantity(payload));
    };

    return (
        <>
            <a onClick={showDrawer}>
                <Badge count={cartItems.length}>
                    <Avatar shape="square" icon={<ShoppingCartOutlined/>} size='large'/>
                </Badge>
            </a>
            {/*<ShoppingCartOutlined style={{fontSize: '32px', color: 'black'}}/>*/}
            <Drawer title="Cart Items" onClose={onClose} open={open}>
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={cartItems}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <CloseOutlined
                                    key="list-loadmore-edit"
                                    id={`delete-icon-${item.id}`}
                                    onClick={() => dispatch(deleteItem({id: item.id}))}/>
                            ]}
                        >
                            {/*<Skeleton avatar>*/}
                            <List.Item.Meta
                                avatar={<Avatar src={item.thumbnail}/>}
                                title={<span>{item.name}</span>}
                                description={
                                    <span><span style={{marginRight: '10px'}}>${item.price}</span>
                                        <InputNumber min={1}
                                                     max={20}
                                                     style={{maxWidth: '70px'}}
                                                     defaultValue={1}
                                                     value={item.quantity}
                                                     onChange={(value: number | null) => onChangeQuantity(item.id, value!)}/>
                                    </span>}
                            />
                            <div>${item.price * item.quantity}</div>
                            {/*</Skeleton>*/}
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    );

};

export default Cart;