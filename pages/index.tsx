import type {NextPage} from 'next'
import React from "react";
import {DefaultLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import MainMenu from "../components/main-menu";
import {Col, Flex, Row} from "antd";
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
            <Flex gap={16}>
                <Col>
                    <SecondaryMenu></SecondaryMenu>
                </Col>
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
            </Flex>
        </DefaultLayout>
    );

}

export default Home
