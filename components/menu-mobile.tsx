import React, { useState } from 'react';
import { Button, Drawer, theme } from 'antd';
import {MenuOutlined} from "@ant-design/icons";

export default function MenuMobile() {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <div className="md:hidden">
            <Button type="link" onClick={showDrawer}>
                <MenuOutlined className="text-lg text-gray-700"/>
            </Button>
            <Drawer className="transition-transform" title="Basic Drawer" onClose={onClose} open={open} placement="left">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>
    );
};
