import React, {useState} from "react";
import {Avatar, Badge, Button, Drawer, InputNumber, List} from 'antd';
import {CloseOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {deleteItem, ICart, ICartItem, setQuantity} from "../stores/cart.reducer";
import {RootState} from "../stores";
import {NextRouter, useRouter} from "next/router";

const Cart = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const [open, setOpen] = useState<boolean>(false);

    const carts: ICart[] = useSelector((state: RootState) => state.cart.carts);

    const showDrawer = (): void => {
        setOpen(true);
    };

    const onClose = (): void => {
        setOpen(false);
    };

    const onChangeQuantity = (id: string, retailerId: string, value: number): void => {
        const payload: { id: string, retailerId: string, value: number } = {id, retailerId, value};
        dispatch(setQuantity(payload));
    };

    const totalCartItems: number = carts.reduce((total: number, cart: ICart) => {
        return total + cart.cartItems.length;
    }, 0);

    return (
        <>
            <a onClick={showDrawer}>
                <Badge count={totalCartItems}>
                    <Avatar shape="square" icon={<ShoppingCartOutlined/>} size='large'/>
                </Badge>
            </a>
            <Drawer title="Giỏ hàng" onClose={onClose} open={open}>
                {
                    carts.map((cart: ICart) => (
                        cart.cartItems.length > 0 ? (
                            <List
                                key={cart.id}
                                className="demo-loadmore-list"
                                itemLayout="horizontal"
                                dataSource={cart.cartItems}
                                renderItem={(item: ICartItem) => (
                                    <List.Item
                                        actions={[
                                            <CloseOutlined
                                                key="list-loadmore-edit"
                                                id={`delete-icon-${item.id}`}
                                                onClick={() => dispatch(deleteItem({
                                                    id: item.id,
                                                    retailerId: item.retailer.id ?? ''
                                                }))}/>
                                        ]}
                                    >
                                        {/*<Skeleton avatar>*/}
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.thumbnail}/>}
                                            title={<span>{item.name}</span>}
                                            description={
                                                <span>
                                                    <span style={{marginRight: '10px'}}>${item.price}</span>
                                                    <InputNumber min={1}
                                                                 max={20}
                                                                 style={{maxWidth: '70px'}}
                                                                 defaultValue={1}
                                                                 value={item.quantity}
                                                                 onChange={(value: number | null) => onChangeQuantity(item.id, item.retailer.id ?? '', value!)}/>
                                                </span>}
                                        />
                                        <div>${item.price * item.quantity}</div>
                                        {/*</Skeleton>*/}
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div key={cart.id}></div>
                        )
                    ))
                }
                <Button className="my-5" type='primary' danger block hidden={carts.length === 0} onClick={() => router.push('/checkout')}>
                    Thanh toán ngay
                </Button>
            </Drawer>
        </>
    );

};

export default Cart;