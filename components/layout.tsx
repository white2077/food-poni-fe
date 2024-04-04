import React from 'react';
import {Layout} from 'antd';
import MainHeader from "./header";
import SecondaryMenu from "./secondary-menu";

const {Header, Footer, Sider, Content} = Layout;
export const DefaultLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <MainHeader></MainHeader>
            </Header>
            <Content style={contentStyle}>{children}</Content>
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
    color: '#fff',
    backgroundColor: '#F5F5FA',
    padding: '0 50px',
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