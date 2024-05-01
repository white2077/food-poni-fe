import type {NextPage} from 'next'
import React, {useEffect} from "react";
import {DefaultLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import MenuMain from "../components/menu-main";
import ProductCategory from "../components/product-category";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {setCurrentShippingAddress} from "../stores/address.reducer";
import {NextRouter, useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {Page} from "../models/Page";
import {setDeliveryInformationList} from "../stores/delivery.reducer";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {CurrentUser} from "../stores/user.reducer";
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
                <ProductCategory/>
                <div className='grid gap-4'>
                    <div className='overflow-hidden relative'>
                        <SearchPosition/>
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
