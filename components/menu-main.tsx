import React, {useState} from 'react';
import {AppstoreOutlined, EnvironmentOutlined, HomeOutlined, StarOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';

const MenuMain = () => {

    const [current, setCurrent] = useState<string>('random');

    const onClick: MenuProps['onClick'] = (e): void => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <div className='overflow-hidden mb-4'>
            <Menu style={{borderRadius: '8px'}} onClick={onClick} selectedKeys={[current]} mode='horizontal'
                  items={items}/>
        </div>
    );

};

const items: MenuProps['items'] = [
    {
        label: 'Random',
        key: 'random',
        icon: <AppstoreOutlined/>,
    },
    {
        label: 'Nearby',
        key: 'nearby',
        icon: <EnvironmentOutlined/>,
    },
    {
        label: 'Promotion',
        key: 'promotion',
        icon: <EnvironmentOutlined/>,
    },
    {
        label: 'Newcomers',
        key: 'newcomers',
        icon: <HomeOutlined/>,
    },
    {
        label: 'Best Sellers',
        key: 'bestsellers',
        icon: <EnvironmentOutlined/>,
    },
    {
        label: 'Top Rates',
        key: 'toprates',
        icon: <StarOutlined/>,
    }
];

export default MenuMain;