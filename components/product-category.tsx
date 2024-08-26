import React, {ReactElement, useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import {useDispatch} from "react-redux";
import {setSelectedProductCategory} from "../stores/product-category.reducer";
import {ProductCategoryAPIResponse} from "../models/product_category/ProductCategoryAPIResponse";
import {server} from "../utils/server";

export interface ICategory {
    key: string;
    label: ReactElement;
}

const ProductCategory = ({categoryList}: { categoryList: ProductCategoryAPIResponse[] }) => {

    const dispatch = useDispatch();

    let items: ICategory[] = [];

    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        getAllCategories();
    }, []);

    const getAllCategories = (): void => {
        categoryList.forEach((category: ProductCategoryAPIResponse) => {
            convertCategory(category, '');
        });
        setCategories(items);
    };

    const convertCategory = (category: ProductCategoryAPIResponse, tab: string): void => {
        items.push({
            key: category.id ?? "",
            label: <span className="flex items-center"><span dangerouslySetInnerHTML={{__html: tab}}></span>
                <img src={server + category.thumbnail} className="w-4 h-4 mr-2"></img> <span className={`${category.parentProductCategory === null ? "font-bold uppercase" : ""}`}>{category.name}</span></span>
        });

        if (category.productCategories?.length)
            category.productCategories.forEach((subCategory: ProductCategoryAPIResponse): void => {
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
                className="rounded-lg !border-none"
                defaultSelectedKeys={['all']}
                mode='inline'
                items={categories}
            />
        </div>
    );
};

export default ProductCategory;