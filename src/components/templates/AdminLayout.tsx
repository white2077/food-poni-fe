import { Layout, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { ReactNode } from "react";
import { SiderAdmin } from "../atoms/SiderAdmin";
import { UserDropdown } from "../molecules/UserDropdown";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout hasSider={true}>
      <SiderAdmin theme="light" />
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <UserDropdown isAdmin={true} />
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
