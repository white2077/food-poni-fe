import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import {WithLeftSiderLayout} from "../components/layout";
import Products from "./products/all-product";
import Carousels from "../components/carousel";
import Menus from "../components/menu";
import {Col, Row} from "antd";

export interface IPost {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
}

const Home: NextPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getAll();
    }, []);

    const getAll = () => {
        console.log("123");
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(
                response => response.json())
            .then(response => {
                console.log("lay du lieu thanh cong");
                setPosts(response);
            })
            .catch(response => console.log(response))
    }

    return (
        <WithLeftSiderLayout>
            <Row gutter={[16,16]}>
                <Col span={24}>
                    <Carousels></Carousels>
                </Col>
                <Col span={24}>
                    <Menus></Menus>
                </Col>
                <Col span={24}>
                    <Products></Products>
                </Col>
            </Row>
        </WithLeftSiderLayout>
    );
}

export default Home
