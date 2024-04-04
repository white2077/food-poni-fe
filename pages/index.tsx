import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import {DefaultLayout, WithLeftSiderLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import MainMenu from "../components/main-menu";
import {Col, Row} from "antd";
import SecondaryMenu from "../components/secondary-menu";

export interface IPost {
    id: number;
    title: string;
    content: string;
    image: string;
    date: string;
}

const Home: NextPage = () => {

    return (
        <DefaultLayout>
            <Row gutter={[16, 16]}>
                <Col xs={0} sm={0} md={0} lg={6} xl={6}>
                    <SecondaryMenu></SecondaryMenu>
                </Col>
                <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                    <Row gutter={[16, 16]}>
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
                </Col>
            </Row>
        </DefaultLayout>
    );

}

export default Home
