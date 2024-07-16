import React, {useState} from "react";
import {DefaultLayout} from "./_layout";
import {Col, Flex, Menu, MenuProps} from "antd";
import AddressDeliveryInformation from "../components/address-delivery-information";
import {EnvironmentOutlined, UserOutlined} from "@ant-design/icons";
import PersonalInformation from "../components/personal-information";
import {NextRequest} from "next/server";
import {getAddressesPage} from "../queries/address.query";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {Page} from "../models/Page";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";

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
    getItem('Thông tin tài khoản', '1', <UserOutlined/>),
    getItem('Sổ địa chỉ', '2', <EnvironmentOutlined/>)
];

export async function getServerSideProps({req}: { req: NextRequest }) {
    return {
        props: {
            ePage: await getAddressesPage({
                refreshToken: getCookie(REFRESH_TOKEN, {req}),
                page: 0,
                pageSize: 10
            })
        }
    };
}

const AccountInformation = ({ePage}: { ePage: Page<AddressAPIResponse[]> }) => {

    const [selectedItem, setSelectedItem] = useState<string>('1');

    const onClick: MenuProps['onClick'] = (e) => {
        // console.log('click ', e);
        setSelectedItem(e.key);
    };

    const contentMap: { [key: string]: React.ReactNode } = {
        '1': <PersonalInformation/>,
        '2': <AddressDeliveryInformation deliveryInformation={ePage.content}/>
    };

    return (
        <DefaultLayout>
            <Flex gap={16}>
                <div className="p-4 bg-white rounded-lg">
                    <div className="mb-4">Danh mục</div>
                    <Col>
                        <div className="mt-[16px]">
                            <Menu
                                onClick={onClick}
                                className="min-w-[256px] rounded-[8px] !border-none"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                items={items}
                            />
                        </div>
                    </Col>
                </div>
                <Col>
                    {contentMap[selectedItem]}
                </Col>
            </Flex>
        </DefaultLayout>
    );

};

export default AccountInformation;