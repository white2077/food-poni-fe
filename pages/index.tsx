import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import {WithLeftSiderLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import MainMenu from "../components/main-menu";
import {Col, Row} from "antd";

export interface IPost {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
}

const Home: NextPage = () => {

    return (
        <WithLeftSiderLayout>
            <Row gutter={[16,16]}>
                <Col span={24}>
                    <CarouselBanner></CarouselBanner>
                </Col>
                <Col span={24}>
                    <MainMenu></MainMenu>
                </Col>
                <Col span={24}>
                    <ProductRows></ProductRows>
                </Col>
            </Row>
        </WithLeftSiderLayout>
    );

}

export default Home
