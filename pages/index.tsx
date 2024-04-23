import type {NextPage} from 'next'
import React, {useEffect} from "react";
import {DefaultLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import MainMenu from "../components/main-menu";
import {Col, Flex, notification, Row} from "antd";
import SecondaryMenu from "../components/secondary-menu";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {Address} from "../model/Address";
import {setCurrentShippingAddress} from "../store/address.reducer";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {CurrentUser} from "../model/User";
import {Page} from "../model/Common";
import {DeliveryInformation} from "../model/DeliveryInformation";
import {setDeliveryInformationList} from "../store/delivery.reducer";

const Home: NextPage = () => {

    const router = useRouter();

    const dispatch = useDispatch();

    const currentUser = useSelector((state: RootState) => state.user.currentUser) as CurrentUser;

    const getShippingAddress = () => {
        const addressId = currentUser.addressId;

        axiosConfig.get(`/addresses/${addressId}`, {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<Address>) {
                dispatch(setCurrentShippingAddress(res.data));
            })
            .catch(function (res) {
                console.log("Shipping address message: ", res.message);
            })
    }

    const getDeliveryInformationList = () => {
        axiosConfig.get("/addresses", {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<Page<DeliveryInformation[]>>) {
                dispatch(setDeliveryInformationList(res.data.content));
            })
            .catch(function (res) {
                console.log("Delivery information message: ", res.message);
            })
    }

    useEffect(() => {
        getShippingAddress();
        getDeliveryInformationList();
    }, [router.isReady]);

    return (
        <DefaultLayout>
            <Flex gap={16}>
                <Col>
                    <SecondaryMenu></SecondaryMenu>
                </Col>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <CarouselBanner></CarouselBanner>
                    </Col>
                    <Col span={24}>
                        <MainMenu></MainMenu>
                    </Col>
                    <Col span={24}>
                        <ProductRows></ProductRows>
                    </Col>
                </Row>
            </Flex>
        </DefaultLayout>
    );

}

export default Home
