import type {NextPage} from 'next'
import React, {useState} from "react";
import {DefaultLayout} from "../components/layout";
import {Col, Flex, Menu, MenuProps} from "antd";
import AddressDeliveryInformation from "../components/address-delivery-information";
import {EnvironmentOutlined, UserOutlined} from "@ant-design/icons";
import PersonalInformation from "../components/personal-information";

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
        </DefaultLayout>
    );

};

export default AccountInformation;