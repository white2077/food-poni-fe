import  { useEffect, useState } from "react";
import { Avatar, Badge, Button, Divider, Drawer, List } from 'antd';
import { CloseOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import QuantityInput from "./quantity-Input";
import EmptyNotice from "./empty-notice";
import {useNavigate} from "react-router-dom";
import {RootState} from "@/redux/store.ts";
import {deleteAllItem, deleteItem, setQuantity} from "@/redux/cart.ts";

const Cart = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const [open, setOpen] = useState<boolean>(false);

    const carts = useSelector((state: RootState) => state.cart.carts);

    const [pending, setPending] = useState<boolean>(false);

    const [totalPrice, setTotalPrice] = useState<number>(0);

    const showDrawer = (): void => {
        setOpen(true);
    };

    const calculateTotalPrice = (): number => {
        let total = 0;
        carts.forEach((cart) => {
            cart.cartItems.forEach((item) => {
                total += item.price * item.quantity;
            });
        });
        return total;
    };

    const onClose = (): void => {
        setOpen(false);
    };

    const onChangeQuantity = (id: string, retailerId: string, value: number): void => {
        const payload: { id: string, retailerId: string, value: number } = { id, retailerId, value };
        dispatch(setQuantity(payload));
    };

    const totalCartItems: number = carts.reduce((total, cart) => {
        return total + cart.cartItems.length;
    }, 0);

    const goToCheckout = () => {
        setPending(true);
        if (currentUser.id) {
            navigate("/checkout");
        } else {
            dispatch(deleteAllItem({}));
            navigate("/login");
            setPending(false);
        }
    }

    useEffect(() => {
        const calculatedTotalPrice = calculateTotalPrice();
        setTotalPrice(calculatedTotalPrice);
    }, [carts]);

    return (
        <div>
            <a onClick={showDrawer} className="cursor-pointer">
                <Badge count={totalCartItems}>
                    <Avatar shape="square" icon={<ShoppingCartOutlined />} size='large' />
                </Badge>
            </a>
            <Drawer title="Giỏ hàng" onClose={onClose} open={open}>
                {carts.length === 0 ? (
                    <EmptyNotice w="60" h="60" src="/no-product.png" message="Giỏ hàng trống" />
                ) : (
                    carts.map((cart) => (
                        cart.cartItems.length > 0 ? (
                            <div key={cart.id}>
                                <div className="text-xl nunito"><span className="text-orange-500 mr-2">Quán:</span>{cart.name}</div>
                                <List
                                    className="demo-loadmore-list"
                                    itemLayout="horizontal"
                                    dataSource={cart.cartItems}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <div className="relative inline-block flex items-center">
                                                        <Avatar className="rounded-lg w-20 h-20" src={item.thumbnail} />
                                                        <div
                                                            className="absolute top-[-5px] w-6 h-6 right-[-5px] bg-gray-300 rounded-[100px] flex p-0 justify-center">
                                                            <CloseOutlined
                                                                className="p-0"
                                                                id={`delete-icon-${item.id}`}
                                                                key="list-loadmore-edit"
                                                                onClick={() =>
                                                                    dispatch(deleteItem({
                                                                        id: item.id,
                                                                        retailerId: item.retailer.id ?? ""
                                                                    }))
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                }
                                                title={<span>{item.name}</span>}
                                                description={
                                                    <span>
                                                        <span style={{ marginRight: "10px" }}>
                                                            {item.price}
                                                            <sup>₫</sup>
                                                        </span>
                                                    </span>
                                                }
                                            />
                                            <div className="mb-auto">
                                                <div className="text-right mb-auto">
                                                    {item.price * item.quantity}
                                                    <sup>₫</sup>
                                                </div>
                                                <QuantityInput item={item} onChangeQuantity={onChangeQuantity} />
                                            </div>
                                        </List.Item>
                                    )}
                                />
                                <Divider />
                            </div>
                        ) : null
                    ))
                )}
                {carts.length > 0 && (
                    <div>
                        <div className="mt-3 flex justify-between">
                            <div>Tổng tiền</div>
                            <div>
                                {totalPrice}
                                <sup>₫</sup>
                            </div>
                        </div>
                        <Divider />
                        <Button className="my-5s mt-2" type='primary' danger block disabled={pending} loading={pending}
                            onClick={goToCheckout}>
                            Thanh toán ngay
                        </Button>
                    </div>
                )}
            </Drawer>
        </div>
    );
};

export default Cart;