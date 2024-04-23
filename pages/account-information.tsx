import type {NextPage} from 'next'
import React from "react";
import {DefaultLayout} from "../components/layout";
import {Col, Flex} from "antd";
import SecondaryMenu from "../components/secondary-menu";
import AddressDeliveryInformation from "../components/address-delivery-information";

const AccountInformation: NextPage = () => {

    return (
        <DefaultLayout>
            <Flex gap={16}>
                <Col>
                    <SecondaryMenu></SecondaryMenu>
                </Col>
                <Col>
                    <AddressDeliveryInformation></AddressDeliveryInformation>
                </Col>
            </Flex>
        </DefaultLayout>
    );

}

export default AccountInformation;