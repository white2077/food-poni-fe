import React, {ReactElement, useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu, Skeleton} from 'antd';
import axiosConfig from "../utils/axios-config";
import {Page} from "../models/Common";
import {AxiosResponse} from "axios";
import {CategoryResponseDTO} from "../models/category/CategoryResponseAPI";

export interface ICategory {
    key: string;
    label: ReactElement;
}

const ProductCategory: React.FC = () => {

    let items: ICategory[] = [{key: "all", label: <span style={{fontWeight: "bold"}}>All</span>}];

    const [categories, setCategories] = useState<ICategory[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllCategories()
    }, []);

    const getAllCategories = (): void => {

        setIsLoading(true);

        axiosConfig.get("/product-categories?onlyParent=true")
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
        console.log('click ', e);
    };

    return (
        <div style={{marginTop: '16px'}}>
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