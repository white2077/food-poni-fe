import { Layout, theme } from "antd";
import { ReactNode } from "react";
import { SiderAdmin } from "../atoms/SiderAdmin";
import { Content, Footer, Header } from "antd/es/layout/layout";


export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <SiderAdmin theme="light" />
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          content="123"
        />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
