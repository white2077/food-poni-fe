import {Avatar, Button, Col, Dropdown, Flex, MenuProps, Row,} from 'antd';
import Cart from './cart';
import SearchComponent from './search-position';
import {useSelector} from 'react-redux';
import {LogoutOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {NextRouter, useRouter} from 'next/router';
import {RootState} from '../stores';
import React from "react";
import {CurrentUser} from "../stores/user.reducer";

const HeaderBar = () => {

    return (
        <div className='lg:w-[1440px] mx-auto text-center'>
            <span className='text-white text-sm'>Happy Valentine's SPRAY! Save an EXTRA 14% off with code #FOODPONI</span>
        </div>
    );

};

export default HeaderBar;