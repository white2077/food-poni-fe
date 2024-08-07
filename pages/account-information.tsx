import React, {useState} from "react";
import {DefaultLayout} from "./_layout";
import {Col, Flex, Image, Menu, MenuProps} from "antd";
import AddressDeliveryInformation from "../components/address-delivery-information";
import {
    CreditCardOutlined,
    CustomerServiceOutlined,
    EnvironmentOutlined,
    LikeOutlined,
    ProfileOutlined,
    UserOutlined
} from "@ant-design/icons";
import PersonalInformation from "../components/personal-information";
import {NextRequest} from "next/server";
import {getAddressesPage} from "../queries/address.query";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN, server} from "../utils/server";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {AddressAPIResponse} from "../models/address/AddressAPIResponse";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import ChangePassword from "../components/change-password";

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
    getItem('Sổ địa chỉ', '2', <EnvironmentOutlined/>),
    getItem('Quản lý đơn hàng - Để tạm form đổi mật khẩu ở đây', '3', <ProfileOutlined/>),
    getItem('Thông tin thanh toán', '4', <CreditCardOutlined/>),
    getItem('Sản phẩm yêu thích', '5', <LikeOutlined/>),
    getItem('Hỗ trợ khách hàng', '6', <CustomerServiceOutlined/>)
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

const AccountInformation = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<AddressAPIResponse[]> }) => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [selectedItem, setSelectedItem] = useState<string>('1');

    const [selectedItemLabel, setSelectedItemLabel] = useState<string>('Thông tin tài khoản');

    const onClick: MenuProps['onClick'] = (e) => {
        setSelectedItem(e.key);
        setSelectedItemLabel(e.domEvent.currentTarget.textContent ?? '');
    };

    const contentMap: { [key: string]: React.ReactNode } = {
        '1': <PersonalInformation/>,
        '2': <AddressDeliveryInformation deliveryInformation={ePage.content}/>,
        '3': <ChangePassword/>
    };

    return (
        <DefaultLayout>
            <Flex gap={16}>
                <div className="p-4 bg-white rounded-lg">
                    <div className="flex">
                        <Image
                            width={50}
                            height={50}
                            className="object-center rounded-full shadow-lg  overflow-hidden object-cover "
                            src={server + currentUser.avatar}
                        />
                        <div className="mx-2">
                            <span className="text-[13px] text-gray-500 font-extralight">Tài khoản của</span>
                            <div>{currentUser.username}</div>
                        </div>
                    </div>
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
                    <div className="my-2 text-[20px] font-sans">{selectedItemLabel}</div>
                    {contentMap[selectedItem]}
                </Col>
            </Flex>
        </DefaultLayout>
    );
};

export default AccountInformation;