import {NextApiRequest, NextApiResponse} from 'next'
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
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {CookieValueTypes, getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {AxiosResponse} from "axios";
import {accessToken, apiWithToken} from "../utils/axios-config";

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

export async function getServerSideProps({req, res}: { req: NextApiRequest, res: NextApiResponse }) {
    const refreshToken: CookieValueTypes = getCookie(REFRESH_TOKEN, {req, res});
    if (refreshToken) {
        try {
            const res: AxiosResponse<Page<AddressResponseDTO[]>> = await apiWithToken(refreshToken).get('/addresses', {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            return {
                props: {
                    deliveryInformation: res.data
                }
            }
        } catch (error) {
            console.error('Error fetching category page:', error);
        }
    }
}

const AccountInformation = ({deliveryInformation = INITIAL_PAGE_API_RESPONSE}: {deliveryInformation: Page<AddressResponseDTO[]>}) => {

    const router: NextRouter = useRouter();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [selectedItem, setSelectedItem] = useState<string>('1');

    const onClick: MenuProps['onClick'] = (e) => {
        // console.log('click ', e);
        setSelectedItem(e.key);
    };

    const contentMap: { [key: string]: React.ReactNode } = {
        '1': <PersonalInformation />,
        '2': <AddressDeliveryInformation deliveryInformation={deliveryInformation} />
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