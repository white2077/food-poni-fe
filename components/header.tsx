import Search from "antd/lib/input/Search";
import {Avatar, Col, Flex, Row} from "antd";
import {useState} from "react";
import Link from "next/link";
import CartComponent from "./cart";
import SearchComponent from "./search";
import {useSelector} from "react-redux";
import {ICartItem} from "../store/cart.reducer";
import {ICurrentUser} from "../store/user.reducer";

const MainHeader = () => {

    const currentUser = useSelector(state => state.user.currentUser) as ICurrentUser;

    return (
        <Row align='middle'>
            <Col flex={2}>
                <Link href={'/'} style={{
                    verticalAlign: 'middle',
                    fontWeight: 'bold',
                    fontSize: '24px'
                }}>Foodponi</Link>
            </Col>
            <Col flex={3}>
                <SearchComponent></SearchComponent>
            </Col>
            <Col flex={2}>
                <Flex gap='middle' align='center' justify='end'>
                        <CartComponent></CartComponent>
                        <Avatar src={currentUser.avatar} style={{verticalAlign: 'middle'}} size="large">
                        </Avatar>
                </Flex>
            </Col>
        </Row>
    )
}

export default MainHeader