import React, {useState} from "react";
import {Avatar, Badge, Drawer, List, Skeleton} from 'antd';
import {ShoppingCartOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {ICartItem} from "../store/cart/reducer";

interface DataType {
    gender?: string;
    name: {
        title?: string;
        first?: string;
        last?: string;
    };
    email?: string;
    picture: {
        large?: string;
        medium?: string;
        thumbnail?: string;
    };
    nat?: string;
    loading: boolean;
}

const CartComponent = () => {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState<DataType[]>([]);
    // const cartItems = useSelector((state: RootState) => state.cart.cartItems) as ICartItem;

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Badge count={5} onClick={showDrawer}>
                <Avatar shape="square" icon={<ShoppingCartOutlined/>} size='large' />
            </Badge>
            {/*<ShoppingCartOutlined style={{fontSize: '32px', color: 'black'}}/>*/}
            <Drawer title="Cart Items" onClose={onClose} open={open}>
                {/*<List*/}
                {/*    className="demo-loadmore-list"*/}
                {/*    itemLayout="horizontal"*/}
                {/*    dataSource={cartItems}*/}
                {/*    renderItem={(item) => (*/}
                {/*        <List.Item*/}
                {/*            actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}*/}
                {/*        >*/}
                {/*            <Skeleton avatar title={false} active>*/}
                {/*                <List.Item.Meta*/}
                {/*                    avatar={<Avatar src={item.thumbnail}/>}*/}
                {/*                    title={<a href="https://ant.design">{item.name}</a>}*/}
                {/*                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"*/}
                {/*                />*/}
                {/*                <div>content</div>*/}
                {/*            </Skeleton>*/}
                {/*        </List.Item>*/}
                {/*    )}*/}
                {/*/>*/}
            </Drawer>
        </>
    );
}

export default CartComponent