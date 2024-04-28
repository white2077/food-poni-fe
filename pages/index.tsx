import type {NextPage} from 'next'
import React, {useEffect} from "react";
import {DefaultLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import MainMenu from "../components/main-menu";
import {Col, Flex, Row} from "antd";
import ProductCategory from "../components/product-category";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {setCurrentShippingAddress} from "../stores/address.reducer";
import {NextRouter, useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {Page} from "../models/Common";
import {setDeliveryInformationList} from "../stores/delivery.reducer";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {CurrentUser} from "../stores/user.reducer";

const Home: NextPage = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const getShippingAddress = (): void => {
        const addressId: string = currentUser.addressId ?? "";

        if (addressId !== "") {
            axiosConfig.get(`/addresses/${addressId}`, {
                headers: {
                    Authorization: 'Bearer ' + currentUser.accessToken,
                }
            })
                .then(function (res: AxiosResponse<AddressResponseDTO>): void {
                    dispatch(setCurrentShippingAddress(res.data));
                })
                .catch(function (res): void {
                    console.log("Shipping address message: ", res.message);
                });
        }
    };

    const getDeliveryInformationList = (): void => {
        axiosConfig.get("/addresses", {
            headers: {
                Authorization: 'Bearer ' + currentUser.accessToken,
            }
        })
            .then(function (res: AxiosResponse<Page<AddressResponseDTO[]>>): void {
                dispatch(setDeliveryInformationList(res.data.content));
            })
            .catch(function (res): void {
                console.log("Delivery information message: ", res.message);
            });
    };

    useEffect((): void => {
        getShippingAddress();
        getDeliveryInformationList();
    }, [router.isReady]);

    return (
        <DefaultLayout>
            <Flex gap={16}>
                <Col>
                    <ProductCategory></ProductCategory>
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

};

export default Home;
