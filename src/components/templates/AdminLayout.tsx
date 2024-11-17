import { Layout, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { ReactNode } from "react";
import { SiderAdmin } from "../atoms/SiderAdmin";
import { UserDropdown } from "../molecules/UserDropdown";
import NotificationDropdown from "@/components/organisms/NotificationDropdown.tsx";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout hasSider={true}>
      <SiderAdmin theme="light" />
      <Layout>
        <Header style={{ padding: "10px 0px", background: colorBgContainer, height: "fit-content" }}>
          <div className="flex items-center justify-end gap-4">
            <NotificationDropdown />
            <UserDropdown isAdmin={true} />
          </div>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
