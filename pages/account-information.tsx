import React, {useState} from "react";
import {DefaultLayout} from "../components/layout";
import {Col, Flex, Menu, MenuProps} from "antd";
import AddressDeliveryInformation from "../components/address-delivery-information";
import {EnvironmentOutlined, UserOutlined} from "@ant-design/icons";
import PersonalInformation from "../components/personal-information";
import {CurrentUser} from "../stores/user.reducer";
import {useSelector} from "react-redux";
import {RootState} from "../stores";
import {NextRouter, useRouter} from "next/router";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";

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

// export async function getServerSideProps({req, res}: { req: NextApiRequest, res: NextApiResponse }) {
//     const refreshToken: CookieValueTypes = getCookie(REFRESH_TOKEN, {req, res});
//     if (refreshToken) {
//         try {
//             const res: AxiosResponse<Page<AddressResponseDTO[]>> = await apiWithToken(refreshToken).get('/addresses', {
//                 headers: {
//                     Authorization: "Bearer " + accessToken
//                 }
//             });
//             console.log(accessToken)
//             return {
//                 props: {
//                     deliveryInformation: res.data
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching category page:', error);
//         }
//     }
// }

const AccountInformation = () => {

    const router: NextRouter = useRouter();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const [selectedItem, setSelectedItem] = useState<string>('1');

    const onClick: MenuProps['onClick'] = (e) => {
        // console.log('click ', e);
        setSelectedItem(e.key);
    };

    const contentMap: { [key: string]: React.ReactNode } = {
        '1': <PersonalInformation/>,
        '2': <AddressDeliveryInformation/>
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