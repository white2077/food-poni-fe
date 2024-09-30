import {useEffect, useState} from "react";
import {Avatar, Badge, Button, Divider, Drawer, List} from 'antd';
import {CloseOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import EmptyNotice from "./empty-notice";
import {useNavigate} from "react-router-dom";
import {RootState} from "@/redux/store.ts";
import {QuantityInput} from "@/components/molecules/quantityInput.tsx";
import {deleteCartRequest, fetchCartRequest} from "@/redux/modules/cart.ts";

const Cart = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const [open, setOpen] = useState<boolean>(false);

    const {page, isLoading} = useSelector((state: RootState) => state.cart.data);

    const [pending, setPending] = useState<boolean>(false);

    const [totalPrice, setTotalPrice] = useState<number>(0);

    const calculateTotalPrice = (): number => {
        let total = 0;
        page.content.forEach((item) => {
            total += item.productDetail.price * item.quantity;
        });
        return total;
    };

    const onClose = (): void => {
        setOpen(false);
    };

    const goToCheckout = () => {
        setPending(true);
        if (currentUser.id) {
            navigate("/checkout");
        } else {
            // dispatch(deleteAllItem({}));
            navigate("/login");
            setPending(false);
        }
    }

    useEffect(() => {
        const calculatedTotalPrice = calculateTotalPrice();
        setTotalPrice(calculatedTotalPrice);
    }, []);

    return (
        <div>
            <a onClick={() => {
                setOpen(true);
                dispatch(fetchCartRequest("createdDate,asc"));
            }} className="cursor-pointer">
                <Badge count={page.totalElements}>
                    <Avatar shape="square" icon={<ShoppingCartOutlined/>} size='large'/>
                </Badge>
            </a>
            <Drawer title="Giỏ hàng" onClose={onClose} open={open}>
                {page.content.length === 0 ? (
                    <EmptyNotice w="60" h="60" src="/no-product.png" message="Giỏ hàng trống"/>
                ) : (
                    <div>
                        <List
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={page.content}
                            loading={isLoading}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <div className="relative inline-block flex items-center">
                                                <Avatar className="rounded-lg w-20 h-20"
                                                        src={item.productDetail.images[0]}/>
                                                <div
                                                    className="absolute top-[-5px] w-6 h-6 right-[-5px] bg-gray-300 rounded-[100px] flex p-0 justify-center">
                                                    <CloseOutlined
                                                        className="p-0"
                                                        id={`delete-icon-${item.id}`}
                                                        key="list-loadmore-edit"
                                                        disabled={item.isDeleteLoading}
                                                        onClick={() => dispatch(deleteCartRequest(item.id))}
                                                    />
                                                </div>
                                            </div>
                                        }
                                        title={<span>{item.productDetail.name}</span>}
                                        description={
                                            <span>
                                                    <span style={{marginRight: "10px"}}>
                                                        {item.productDetail.price}
                                                        <sup>₫</sup>
                                                    </span>
                                                </span>
                                        }
                                    />
                                    <div className="mb-auto">
                                        <div className="text-right mb-auto">
                                            {item.productDetail.price * item.quantity}
                                            <sup>₫</sup>
                                        </div>
                                        <QuantityInput item={item}/>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Divider/>
                    </div>
                )}
                {page.content.length > 0 && (
                    <div>
                        <div className="mt-3 flex justify-between">
                            <div>Tổng tiền</div>
                            <div>
                                {totalPrice}
                                <sup>₫</sup>
                            </div>
                        </div>
                        <Divider/>
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