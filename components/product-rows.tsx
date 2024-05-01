import {Skeleton} from 'antd';
import React, {useEffect, useState} from 'react';
import ProductCard from "./product-card";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {setProductList} from "../stores/product.reducer";
import axiosConfig from "../utils/axios-config";
import {AxiosResponse} from "axios";
import {Page} from "../models/Page";
import {ProductResponseDTO} from "../models/product/ProductResponseAPI";
import {ProductDetailResponseDTO} from "../models/product_detail/ProductDetailResponseAPI";
import {CurrentUser} from "../stores/user.reducer";
import {SearchResult} from "./address-add";
import {NextRouter, useRouter} from "next/router";

export interface IProductCard {
    id: string;
    name: string;
    thumbnail: string;
    minPrice: number;
    maxPrice: number;
    rate: number;
}

const ProductRows = () => {

    const router: NextRouter = useRouter();

    const dispatch = useDispatch();

    const currentUser: CurrentUser = useSelector((state: RootState) => state.user.currentUser);

    const {products, isLoading} = useSelector((state: RootState) => state.productList);

    const [showModal, setShowModal] = useState<boolean>(false);

    const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

    const [dataSource, setDataSource] = useState<SearchResult[]>([]);

    const [selectedAddress, setSelectedAddress] = useState<SearchResult | null>(null);

    const [selectedAddressData, setSelectedAddressData] = useState<SearchResult | null>(null);

    let timeout: NodeJS.Timeout | null = null;

    useEffect((): void => {
        getProducts();
    }, []);

    const getProducts = (): void => {
        axiosConfig.get("/products?status=true")
            .then((res: AxiosResponse<Page<ProductResponseDTO[]>>): void => {
                const productList: IProductCard[] = [];

                (res.data.content as ProductResponseDTO[]).map((product: ProductResponseDTO): void => {
                    if (currentUser && currentUser.accessToken && currentUser.role === "RETAILER" && currentUser.id == product.user?.id) {
                        return;
                    }

                    const productDetails: ProductDetailResponseDTO[] = product.productDetails ?? [];
                    const prices: number[] = productDetails
                        .map((productDetail: ProductDetailResponseDTO) => productDetail.price)
                        .filter((price: number | undefined): price is number => price !== undefined);
                    const minPrice: number = prices.length > 0 ? Math.min(...prices) : 0;
                    const maxPrice: number = prices.length > 0 ? Math.max(...prices) : 0;

                    const productCard: IProductCard = {
                        id: product.id ?? "",
                        name: product.name ?? "",
                        thumbnail: product.thumbnail ?? "",
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        rate: product.rate ?? 0,
                        // minPrice: Math.min(...product.productDetails.map((productDetail: ProductDetailResponseDTO) => productDetail.price)),
                        // maxPrice: Math.max(...product.productDetails.map((productDetail: ProductDetailResponseDTO) => productDetail.price)),
                    };

                    productList.push(productCard);
                });

                dispatch(setProductList({products: productList, isLoading: false}));
            })
            .catch(err => {
                console.log(err)
            });
    };

    // const handleAccept = () => {
    //     setShowModal(false);
    //     setShowSearchModal(true);
    // };
    //
    // const handleClose = () => {
    //     setShowModal(false);
    // };
    //
    // useEffect(() => {
    //     if (router.isReady) {
    //         if (!localStorage.getItem('modalShown')) {
    //             setShowModal(true);
    //             localStorage.setItem('modalShown', 'true');
    //         }
    //     }
    // }, [router.isReady]);
    //
    // const delayedSearch = (value: string): void => {
    //     if (timeout) {
    //         clearTimeout(timeout);
    //     }
    //
    //     timeout = setTimeout((): void => {
    //         axios
    //             .get<SearchResult[]>(`https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1`)
    //             .then((response: AxiosResponse<SearchResult[]>): void => {
    //                 const results: {
    //                     display_name: string,
    //                     lon: number,
    //                     lat: number
    //                 }[] = response.data.map((item: SearchResult) => ({
    //                     display_name: item.display_name,
    //                     lon: item.lon,
    //                     lat: item.lat
    //                 }));
    //
    //                 setDataSource(results);
    //             })
    //             .catch((error): void => {
    //                 console.error(error);
    //             });
    //     }, 500);
    // };
    //
    // const onSearch = (value: string): void => {
    //     delayedSearch(value);
    // };
    //
    // const onSelect = (value: string, option: { data: SearchResult }): void => {
    //     setSelectedAddress(option.data);
    // };
    //
    // const handleAcceptSearch = () => {
    //     setShowSearchModal(false);
    //     setSelectedAddressData(selectedAddress);
    // };
    //
    // const handleCloseSearch = () => {
    //     setShowSearchModal(false);
    // };

    return (
        <>
            <Skeleton loading={isLoading} active/>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {products.map((product: IProductCard) => (
                    <ProductCard key={product.id} product={product} selectedAddressData={selectedAddressData}/>
                ))}
            </div>

            {/*<Modal*/}
            {/*    open={showModal}*/}
            {/*    centered*/}
            {/*    title="Your current address"*/}
            {/*    onOk={handleAccept}*/}
            {/*    onCancel={handleClose}*/}
            {/*>*/}
            {/*    <p>Bạn có muốn sử dụng địa chỉ hiện tại không?</p>*/}
            {/*</Modal>*/}

            {/*<Modal*/}
            {/*    open={showSearchModal}*/}
            {/*    centered*/}
            {/*    title="Your current address"*/}
            {/*    onOk={handleAcceptSearch}*/}
            {/*    onCancel={handleCloseSearch}*/}
            {/*>*/}
            {/*    <AutoComplete*/}
            {/*        options={dataSource.map((result: SearchResult) => ({*/}
            {/*            value: result.display_name,*/}
            {/*            label: result.display_name,*/}
            {/*            data: result*/}
            {/*        }))}*/}
            {/*        onSelect={onSelect}*/}
            {/*        onSearch={onSearch}*/}
            {/*        placeholder="input search text"*/}
            {/*        style={{width: '100%'}}>*/}
            {/*        <Input.Search enterButton/>*/}
            {/*    </AutoComplete>*/}
            {/*</Modal>*/}
        </>
    );

};

export default ProductRows;