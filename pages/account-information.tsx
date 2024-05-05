import type {NextPage} from 'next'
import React, {useState} from "react";
import {DefaultLayout} from "../components/layout";
import {Button, Col, Flex, Menu, MenuProps, Result} from "antd";
import AddressDeliveryInformation from "../components/address-delivery-information";
import {EnvironmentOutlined, UserOutlined} from "@ant-design/icons";
import PersonalInformation from "../components/personal-information";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {NextRouter, useRouter} from "next/router";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem('Personal information', '1', <UserOutlined />),
    getItem('Delivery address', '2', <EnvironmentOutlined />)
];

const AccountInformation: NextPage = () => {

    const router: NextRouter = useRouter();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [selectedItem, setSelectedItem] = useState<string>('1');

    const onClick: MenuProps['onClick'] = (e) => {
        // console.log('click ', e);
        setSelectedItem(e.key);
    };

    const contentMap: { [key: string]: React.ReactNode } = {
        '1': <PersonalInformation />,
        '2': <AddressDeliveryInformation />
    };

    return (
        <DefaultLayout>
            {
                currentUser.id ? (
                    <Flex gap={16}>
                        <Col>
                            <div style={{marginTop: '16px'}}>
                                <Menu
                                    onClick={onClick}
                                    style={{width: 256}}
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    mode="inline"
                                    items={items}
                                />
                            </div>
                        </Col>
                        <Col>
                            {contentMap[selectedItem]}
                        </Col>
                    </Flex>
                ) : (
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={<Button type="primary" onClick={() => router.push('/')}>Back Home</Button>}
                    />
                )
            }
        </DefaultLayout>
    );

};

export default AccountInformation;