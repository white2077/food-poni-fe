import React from 'react';
import {Carousel, Layout} from 'antd';
import MainHeader from "./header";
import Carousels from "./carousel-banner";
import SecondaryMenu from "./secondary-menu";
import CarouselBanner from "./image-product-detail.";
import ImageProductDetail from "./image-product-detail.";

const {Header, Footer, Sider, Content} = Layout;
export const DefaultLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>{children}</Content>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    )
}

export const WithRightSiderLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>Header</Header>
            <Layout>
                <Content style={contentStyle}>{children}</Content>
                <Sider width="25%" style={siderStyle}>
                    Sider
                </Sider>
            </Layout>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    )
}

export const WithLeftSiderLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <MainHeader></MainHeader>
            </Header>

            <Content style={contentStyle}>
                <Layout>
                    <Sider width="20%" style={siderStyle}>
                        <SecondaryMenu></SecondaryMenu>
                    </Sider>
                    {children}
                </Layout>
            </Content>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    )
}

export const WithTwoSiderLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <MainHeader></MainHeader>
            </Header>
            <Layout>
                <Sider width="25%" style={siderStyle}>
                    <ImageProductDetail></ImageProductDetail>
                </Sider>
                <Content style={contentStyle}>{children}</Content>
                <Sider width="25%" style={siderStyle}>

                </Sider>
            </Layout>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    )
}


const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#fff',
};

const contentStyle: React.CSSProperties = {
    padding: '0 48px',
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#F5F5FA',
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: 'transparent',
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};

const layoutStyle = {
    overflow: 'hidden',
};