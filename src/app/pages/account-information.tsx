import React, {useState} from "react";
import {Col, Flex, Image, Menu, MenuProps} from "antd";
import {
    CreditCardOutlined,
    CustomerServiceOutlined,
    EnvironmentOutlined,
    LikeOutlined,
    ProfileOutlined,
    UserOutlined
} from "@ant-design/icons";
import PersonalInformation from "@/components/personal-information.tsx";
import AddressDeliveryInformation from "@/components/address-delivery-information.tsx";
import {server} from "@/utils/server.ts";
import {CurrentUser} from "@/redux/modules/user.ts";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {ProductLoading} from "@/components/atoms/productLoading.tsx";

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
    getItem('Quản lý đơn hàng', '3', <ProfileOutlined/>),
    getItem('Thông tin thanh toán', '4', <CreditCardOutlined/>),
    getItem('Sản phẩm yêu thích', '5', <LikeOutlined/>),
    getItem('Hỗ trợ khách hàng', '6', <CustomerServiceOutlined/>)
];

// export async function getServerSideProps({req}: { req: NextRequest }) {
//     try {
//         const ePage: Page<AddressAPIResponse[]> = await getAddressesPage({
//             refreshToken: getCookie(REFRESH_TOKEN, {req}),
//             page: 0,
//             pageSize: 10
//         });
//         return {props: {ePage}};
//     } catch (e) {
//         throw e;
//     }
// }
//
// interface AccountInformationPageProps {
//     ePage: Page<AddressAPIResponse[]>
// }

const AccountInformation = () => {
    const currentUser: CurrentUser = useSelector((state: RootState) => state.auth);

    const [selectedItem, setSelectedItem] = useState<string>('1');

    const [selectedItemLabel, setSelectedItemLabel] = useState<string>('Thông tin tài khoản');

    const onClick: MenuProps['onClick'] = (e) => {
        setSelectedItem(e.key);
        setSelectedItemLabel(e.domEvent.currentTarget.textContent ?? '');
    };

    const contentMap: { [key: string]: React.ReactNode } = {
        '1': <PersonalInformation/>,
        // '2': <AddressDeliveryInformation deliveryInformation={n}/>
    };

    return (
         currentUser ? (<>
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
                             <div className="nunito text-orange-500">{currentUser.username}</div>
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
                     {contentMap[selectedItem]}
                 </Col>
             </Flex></>) :
             (ProductLoading)
    );
};
export default AccountInformation;