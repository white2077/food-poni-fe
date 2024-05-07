import React, {ReactElement, useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu, Skeleton} from 'antd';
import {Page} from "../models/Page";
import {AxiosResponse} from "axios";
import {CategoryResponseDTO} from "../models/category/CategoryResponseAPI";
import {useDispatch} from "react-redux";
import {setSelectedProductCategory} from "../stores/product-category.reducer";
import axiosInterceptor from "../utils/axiosInterceptor";

export interface ICategory {
    key: string;
    label: ReactElement;
}

const ProductCategory = () => {

    const dispatch = useDispatch();

    let items: ICategory[] = [{key: "all", label: <span style={{fontWeight: "bold"}}>All</span>}];

    const [categories, setCategories] = useState<ICategory[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllCategories()
    }, []);

    const getAllCategories = (): void => {

        setIsLoading(true);

        axiosInterceptor.get("/product-categories?onlyParent=true")
            .then((res: AxiosResponse<Page<CategoryResponseDTO[]>>) => {
                res.data.content.forEach((category: CategoryResponseDTO) => {
                    convertCategory(category, '');
                });
                setCategories(items);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err)
            });

    };

    const convertCategory = (category: CategoryResponseDTO, tab: string): void => {
        items.push({key: category.id ?? "", label: <span dangerouslySetInnerHTML={{ __html: tab + category.categoryName ?? "" }}></span>});

        if (category.categories?.length)
            category.categories.forEach((subCategory: CategoryResponseDTO): void => {
                convertCategory(subCategory, tab + '&emsp;');
            });
    };

    const onClick: MenuProps['onClick'] = (e): void => {
        dispatch(setSelectedProductCategory(e.key));
    };

    return (
        <div className='hidden md:block'>

            <Skeleton loading={isLoading} active></Skeleton>
            <Menu
                onClick={onClick}
                style={{minWidth: 256, borderRadius: '8px'}}
                defaultSelectedKeys={['all']}
                mode='inline'
                items={categories}
            />
        </div>
    );
};

export default ProductCategory;