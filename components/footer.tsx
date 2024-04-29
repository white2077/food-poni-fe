import {Avatar, Button, Col, Dropdown, Flex, MenuProps, Row,} from 'antd';
import CartComponent from './cart';
import SearchComponent from './search';
import {useSelector} from 'react-redux';
import {LogoutOutlined, ShoppingOutlined, UserOutlined} from '@ant-design/icons';
import {NextRouter, useRouter} from 'next/router';
import {RootState} from '../stores';
import React from "react";
import {CurrentUser} from "../stores/user.reducer";

const Footer = () => {

    return (
        <div className='grid grid-cols-[1fr_2fr_1fr] px-10 mx-auto items-center py-2'>

        </div>
    );

};

export default Footer;