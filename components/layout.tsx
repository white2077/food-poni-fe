import React from 'react';
import {Layout} from 'antd';
import MainHeader from "./header";

const {Header, Footer, Sider, Content} = Layout;
export const DefaultLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <MainHeader/>
            </Header>
            <Content style={contentStyle}>{children}</Content>
            <Footer style={footerStyle}>Footer</Footer>
        </Layout>
    )
}

const headerStyle: React.CSSProperties = {
    backgroundColor: '#fff',
};

const contentStyle: React.CSSProperties = {
    backgroundColor: '#F5F5FA',
    padding: '0 10px',
    maxWidth: '1440px',
    margin: '0 auto'
};

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};

const layoutStyle = {
    overflow: 'hidden',
};