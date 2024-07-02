import React, {useEffect, useState} from 'react';
import {AppstoreOutlined, DollarOutlined, EnvironmentOutlined, StarOutlined, TagOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {setSelectedMainMenu} from "../stores/main-menu.reducer";
import {RootState} from "../stores";

const MenuMain = () => {

    const dispatch = useDispatch();

    const currentMainMenu: string = useSelector((state: RootState) => state.mainMenu.currentMainMenu);

    const onClick: MenuProps['onClick'] = (e) => {
        dispatch(setSelectedMainMenu(e.key));
    };

    return (
        <div className='overflow-hidden mb-4'>
            <Menu className="rounded-[8px]"
                  onClick={onClick}
                  selectedKeys={[currentMainMenu]}
                  mode='horizontal'
                  items={items}/>
        </div>
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

export default MenuMain;