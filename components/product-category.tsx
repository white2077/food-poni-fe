import React, {ReactElement, useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Card, Menu} from 'antd';
import {CategoryResponseDTO} from "../models/category/CategoryAPIResponse";
import {useDispatch} from "react-redux";
import {setSelectedProductCategory} from "../stores/product-category.reducer";
import {HomeFilled} from "@ant-design/icons";

export interface ICategory {
    key: string;
    label: ReactElement;
}

const ProductCategory = ({categoryList}: { categoryList: CategoryResponseDTO[] }) => {

    const dispatch = useDispatch();

    let items: ICategory[] = [{key: "all", label: <span style={{fontWeight: "bold"}}>All</span>}];

    const [categories, setCategories] = useState<ICategory[]>([]);

    // const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getAllCategories()
    }, []);

    const getAllCategories = (): void => {
        categoryList.forEach((category: CategoryResponseDTO) => {
            convertCategory(category, '');
        });
        setCategories(items);
    };

    const convertCategory = (category: CategoryResponseDTO, tab: string): void => {
        items.push({
            key: category.id ?? "",
            label: <span className="flex items-center"><span dangerouslySetInnerHTML={{__html: tab}}></span><img
                src="/favicon.ico" className="w-4 h-4 mr-2"></img> {category.categoryName}</span>
        });

        if (category.categories?.length)
            category.categories.forEach((subCategory: CategoryResponseDTO): void => {
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