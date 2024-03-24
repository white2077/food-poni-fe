import React, {useState} from "react";
import {Drawer} from 'antd';
import {ShoppingCartOutlined} from "@ant-design/icons";

const CartComponent = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
            <ShoppingCartOutlined style={{fontSize: '32px', color: 'black'}} onClick={showDrawer}/>
            <Drawer title="Basic Drawer" onClose={onClose} open={open}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </>
    );
}

export default CartComponent