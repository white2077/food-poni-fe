import React, {useState} from 'react';
import {AppstoreOutlined, EnvironmentOutlined, HomeOutlined, StarOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';

const MenuMobile = () => {

    const [current, setCurrent] = useState<string>('mail');

    const onClick: MenuProps['onClick'] = (e): void => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <Menu style={{borderRadius: '8px'}} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
    );

};

const items: MenuProps['items'] = [
    {
        label: 'Nearby',
        key: 'nearby',
        icon: <EnvironmentOutlined />,
    },
    {
        label: 'Promotion',
        key: 'promotion',
        icon: <EnvironmentOutlined />,
    },
    {
        label: 'Newcomers',
        key: 'newcomers',
        icon: <HomeOutlined />,
    },
    {
        label: 'Best Sellers',
        key: 'bestsellers',
        icon: <EnvironmentOutlined />,
    },
    {
        label: 'Top Rates',
        key: 'toprates',
        icon: <StarOutlined />,
    },
    {
        label: 'All',
        key: 'all',
        icon: <AppstoreOutlined />,
    }
];

export default MenuMobile;