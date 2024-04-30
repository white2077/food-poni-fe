import type {NextPage} from 'next'
import React, {useEffect, useState} from "react";
import {DefaultLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import MenuMain from "../components/menu-main";
import {AutoComplete, Input, Modal} from "antd";
import ProductCategory from "../components/product-category";
import axiosConfig from "../utils/axios-config";
import axios, {AxiosResponse} from "axios";
import {setCurrentShippingAddress} from "../stores/address.reducer";
import {NextRouter, useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {setDeliveryInformationList} from "../stores/delivery.reducer";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {CurrentUser} from "../stores/user.reducer";
import {SearchResult} from "../components/address-add";
import SearchPosition from "../components/search-position";

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
        if (currentUser && currentUser.accessToken) {
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
        }
    };

    useEffect((): void => {
        getShippingAddress();
        getDeliveryInformationList();
    }, [router.isReady]);

    return (
        <DefaultLayout>
            <div className='flex gap-4'>
                <div className='hidden md:block'>
                    <ProductCategory/>
                </div>
                <div className='grid gap-4'>
                    <div className='overflow-hidden relative'>
                        <div className='absolute left-4 bottom-4 z-10'>
                            <SearchPosition/>
                        </div>
                        <CarouselBanner/>
                    </div>
                    <MenuMain/>
                    <ProductRows/>
                </div>
            </div>
        </DefaultLayout>
    );

};

export default Home;
