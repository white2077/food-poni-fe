import React, {useState} from 'react';
import {
    AppstoreOutlined,
    DollarOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    StarOutlined,
    TagOutlined
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {setSelectedMainMenu} from "../stores/main-menu.reducer";

const MenuMobile = () => {

    const dispatch = useDispatch();

    const currentMainMenu: string = useSelector((state: RootState) => state.mainMenu.currentMainMenu);

    const onClick: MenuProps['onClick'] = (e) => {
        dispatch(setSelectedMainMenu(e.key));
    };

    return (
        <Menu className="rounded-[8px]" onClick={onClick} selectedKeys={[currentMainMenu]} mode="horizontal" items={items} />
    );

};

const items: MenuProps['items'] = [
    {
        label: 'Tất cả',
        key: 'all',
        icon: <AppstoreOutlined/>,
    },
    {
        label: 'Gần bạn',
        key: 'nearby',
        icon: <EnvironmentOutlined/>,
    },
    {
        label: 'Khuyến mãi',
        key: 'promotion',
        icon: <DollarOutlined />,
    },
    {
        label: 'Mới nhất',
        key: 'bestnews',
        icon: <TagOutlined />,
    },
    {
        label: 'Bán chạy nhất',
        key: 'bestsellers',
        icon: <EnvironmentOutlined/>,
    },
    {
        label: 'Đánh giá hàng đầu',
        key: 'toprates',
        icon: <StarOutlined/>,
    }
];

export default MenuMobile;