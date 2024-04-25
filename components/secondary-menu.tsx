import React, {useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu, Skeleton} from 'antd';
import axiosConfig from "../utils/axios-config";
import {Page} from "../model/Common";
import {AxiosResponse} from "axios";
import {CategoryResponseDTO} from "../model/category/CategoryResponseAPI";

export interface ICategory {
    id: string;
    name: string;
    tab: string;
}

const SecondaryMenu: React.FC = () => {

    let items: ICategory[] = [];

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
        items.push({id: category.id, name: category.categoryName, tab: tab});

        if (category.categories.length)
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
            >
                <Menu.Item key='all'>
                    <span>All</span>
                </Menu.Item>
                {categories.map((category) => {
                    return (
                        <Menu.Item key={category.id}>
                            <span dangerouslySetInnerHTML={{__html: category.tab || ''}}></span>
                            <span>{category.name}</span>
                        </Menu.Item>
                    )
                })}
            </Menu>
        </div>
    );

};

export default SecondaryMenu;