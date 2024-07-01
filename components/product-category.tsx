import React, {ReactElement, useEffect, useState} from 'react';
import type {MenuProps} from 'antd';
import {Card, Menu} from 'antd';
import {CategoryResponseDTO} from "../models/category/CategoryResponseAPI";
import {useDispatch} from "react-redux";
import {setSelectedProductCategory} from "../stores/product-category.reducer";

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
            label: <span dangerouslySetInnerHTML={{__html: tab + category.categoryName ?? ""}}></span>
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
        <div className='hidden md:block'>
            {/*<Skeleton loading={isLoading} active></Skeleton>*/}
            <div className="p-4 bg-white rounded-lg">
                <div className="mb-4">Categories</div>
                <Menu
                    onClick={onClick}
                    style={{minWidth: 256, borderRadius: '8px', border: 'none'}}
                    defaultSelectedKeys={['all']}
                    mode='inline'
                    items={categories}
                />
            </div>
        </div>
    );
};

export default ProductCategory;