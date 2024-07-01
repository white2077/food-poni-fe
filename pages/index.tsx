import React, {useEffect} from "react";
import {DefaultLayout} from "../components/layout";
import ProductRows from "../components/product-rows";
import CarouselBanner from "../components/carousel-banner";
import MenuMain from "../components/menu-main";
import ProductCategory from "../components/product-category";
import SearchPosition from "../components/search-position";
import {NextRouter, useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {CurrentUser} from "../stores/user.reducer";
import store, {RootState} from "../stores";
import {accessToken, api, apiWithToken} from "../utils/axios-config";
import {AxiosError, AxiosResponse} from "axios";
import {AddressResponseDTO} from "../models/address/AddressResponseAPI";
import {setCurrentShippingAddress} from "../stores/address.reducer";
import {ErrorApiResponse} from "../models/ErrorApiResponse";
import {INITIAL_PAGE_API_RESPONSE, Page} from "../models/Page";
import {CategoryResponseDTO} from "../models/category/CategoryResponseAPI";
import {getCookie} from "cookies-next";
import {REFRESH_TOKEN} from "../utils/server";
import {Card} from "antd";

export async function getServerSideProps() {
    try {
        const res: AxiosResponse<Page<CategoryResponseDTO[]>> = await api.get("/product-categories?onlyParent=true");
        return {
            props: {
                ePage: res.data
            },
        };
    } catch (error) {
        console.error('Error fetching category page:', error);
    }
}

const Home = ({ePage = INITIAL_PAGE_API_RESPONSE}: { ePage: Page<CategoryResponseDTO[]> }) => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const refreshToken = getCookie(REFRESH_TOKEN);

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const getShippingAddress = (): void => {
        const addressId: string = currentUser.addressId ?? "";

        if (addressId !== "" && refreshToken) {
            apiWithToken(store.dispatch, refreshToken).get(`/addresses/${addressId}`, {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                }
            })
                .then(function (res: AxiosResponse<AddressResponseDTO>): void {
                    dispatch(setCurrentShippingAddress(res.data));
                })
                .catch(function (res: AxiosError<ErrorApiResponse>): void {
                    console.log("Shipping address message: ", res.message);
                });
        }
    };

    useEffect(() => {
        getShippingAddress();
    }, [refreshToken]);

    return (
        <DefaultLayout>
            <div className='flex gap-4'>
                <div className='grid gap-4'>
                    <ProductCategory categoryList={ePage.content}/>
                    <img className='rounded-md'
                         src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-GyDWnLZ77IVqwCBJYj3KSEafcAMiGAfJlj1kqG0U_Q&s"/>
                </div>
                <div className='grid gap-4 h-fit'>
                    <div className='overflow-hidden relative'>
                        <CarouselBanner/>
                        <SearchPosition/>
                    </div>

                    <ProductRows/>
                </div>
            </div>
        </DefaultLayout>
    );

};

export default Home;
