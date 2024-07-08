import React, {ReactElement, useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {useDispatch} from "react-redux";
import {setSelectedProductCategory} from "../stores/product-category.reducer";
import {CategoryAPIResponse} from "../models/category/CategoryAPIResponse";
import {server} from "../utils/server";

export interface ICategory {
    key: string;
    label: ReactElement;
}

const ProductCategory = ({categoryList}: { categoryList: CategoryAPIResponse[] }) => {

    const dispatch = useDispatch();

    let items: ICategory[] = [{key: "all", label: <span className="font-bold">All</span>}];

    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        getAllCategories();
    }, []);

    const getAllCategories = (): void => {
        categoryList.forEach((category: CategoryAPIResponse) => {
            convertCategory(category, '');
        });
        setCategories(items);
    };

    const convertCategory = (category: CategoryAPIResponse, tab: string): void => {
        items.push({
            key: category.id ?? "",
            label: <span className="flex items-center"><span dangerouslySetInnerHTML={{__html: tab}}></span>
                <img src={server + category.image} className="w-4 h-4 mr-2 rounded-full"></img> {category.categoryName}</span>
        });

        if (category.categories?.length)
            category.categories.forEach((subCategory: CategoryAPIResponse): void => {
                convertCategory(subCategory, tab + '&emsp;');
            });
    };

    const onClick: MenuProps['onClick'] = (e): void => {
        dispatch(setSelectedProductCategory(e.key));
    };

    return (
        <div className="p-4 bg-white rounded-lg">
            <div className="mb-4">Danh mục</div>
            <Menu
                onClick={onClick}
                className="min-w-[200px] rounded-log !border-none"
                defaultSelectedKeys={['all']}
                mode='inline'
                items={categories}
            />
        </div>
    );
};

export default ProductCategory;