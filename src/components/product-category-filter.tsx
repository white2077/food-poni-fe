import React, { ReactElement, useEffect, useState } from 'react';
import { Menu, Slider, Input, Select, Checkbox, Rate, Button } from 'antd';
import type { MenuProps } from 'antd';
import { ProductCategoryAPIResponse } from "../models/product_category/ProductCategoryAPIResponse";
import { server } from "../utils/server";
import { NextRouter, useRouter } from "next/router";

const { Search } = Input;
const { Option } = Select;

export interface ICategory {
    key: string;
    label: ReactElement;
}

const ProductCategoryFilter = ({ categoryList }: { categoryList: ProductCategoryAPIResponse[] }) => {
    const router: NextRouter = useRouter();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('relevance');
    const [inStock, setInStock] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);
    const [freeShipping, setFreeShipping] = useState<boolean>(false);
    const [discounted, setDiscounted] = useState<boolean>(false);

    useEffect(() => {
        getAllCategories();
    }, []);

    const getAllCategories = (): void => {
        const items: ICategory[] = categoryList.map((category: ProductCategoryAPIResponse) =>
            convertCategory(category, '')
        ).flat();
        setCategories(items);
    };

    const convertCategory = (category: ProductCategoryAPIResponse, tab: string): ICategory[] => {
        const result: ICategory[] = [{
            key: category.slug ?? "",
            label: <span className="flex items-center">
                <span dangerouslySetInnerHTML={{ __html: tab }}></span>
                <img src={server + category.thumbnail} className="w-4 h-4 mr-2" alt={category.name} />
                <span className={`${category.parentProductCategory === null ? "font-bold uppercase" : ""}`}>{category.name}</span>
            </span>
        }];

        if (category.productCategories?.length) {
            category.productCategories.forEach((subCategory: ProductCategoryAPIResponse): void => {
                result.push(...convertCategory(subCategory, tab + '&emsp;'));
            });
        }

        return result;
    };

    const onCategoryClick: MenuProps['onClick'] = (e): void => {
        router.push(`/danh-muc/${e.key}`);
    };

    const onPriceChange = (value: number[]) => {
        setPriceRange(value as [number, number]);
        updateRouterQuery({ minPrice: value[0], maxPrice: value[1] });
    };

    const onSearch = (value: string) => {
        setSearchTerm(value);
        updateRouterQuery({ search: value });
    };

    const onSortChange = (value: string) => {
        setSortBy(value);
        updateRouterQuery({ sortBy: value });
    };

    const onInStockChange = (e: any) => {
        setInStock(e.target.checked);
        updateRouterQuery({ inStock: e.target.checked });
    };

    const onRatingChange = (value: number) => {
        setRating(value);
        updateRouterQuery({ rating: value });
    };

    const onFreeShippingChange = (e: any) => {
        setFreeShipping(e.target.checked);
        updateRouterQuery({ freeShipping: e.target.checked });
    };

    const onDiscountedChange = (e: any) => {
        setDiscounted(e.target.checked);
        updateRouterQuery({ discounted: e.target.checked });
    };

    const updateRouterQuery = (newQuery: any) => {
        router.push({
            pathname: router.pathname,
            query: { ...router.query, ...newQuery },
        });
    };

    const resetFilters = () => {
        setPriceRange([0, 1000000]);
        setSearchTerm('');
        setSortBy('relevance');
        setInStock(false);
        setRating(0);
        setFreeShipping(false);
        setDiscounted(false);
        router.push({
            pathname: router.pathname,
            query: {},
        });
    };

    return (
        <div className="p-4 bg-white rounded-lg">
            <div className="mb-4 font-bold">Bộ lọc</div>
            <div className="mb-4">
                <Search
                    placeholder="Tìm kiếm sản phẩm"
                    onSearch={onSearch}
                    className="mb-4"
                />
                <div className="mb-2">Sắp xếp theo</div>
                <Select defaultValue="relevance" style={{ width: '100%' }} onChange={onSortChange}>
                    <Option value="relevance">Liên quan</Option>
                    <Option value="price_asc">Giá tăng dần</Option>
                    <Option value="price_desc">Giá giảm dần</Option>
                    <Option value="newest">Mới nhất</Option>
                </Select>
            </div>
            <div className="mb-4">
                <div className="mb-2">Khoảng giá</div>
                <Slider
                    range
                    min={0}
                    max={1000000}
                    step={10000}
                    defaultValue={priceRange}
                    onChange={onPriceChange}
                    tipFormatter={(value) => `${value?.toLocaleString('vi-VN')}đ`}
                />
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0].toLocaleString('vi-VN')}đ</span>
                    <span>{priceRange[1].toLocaleString('vi-VN')}đ</span>
                </div>
            </div>
            <div className="mb-4">
                <Checkbox onChange={onInStockChange}>Chỉ hiển thị sản phẩm còn hàng</Checkbox>
            </div>
            <div className="mb-4">
                <div className="mb-2">Đánh giá</div>
                <Rate onChange={onRatingChange} value={rating} />
            </div>
            <div className="mb-4">
                <Checkbox onChange={onFreeShippingChange}>Miễn phí vận chuyển</Checkbox>
            </div>
            <div className="mb-4">
                <Checkbox onChange={onDiscountedChange}>Đang giảm giá</Checkbox>
            </div>
            <Button onClick={resetFilters} type="primary" className="w-full">
                Đặt lại bộ lọc
            </Button>
        </div>
    );
};

export default ProductCategoryFilter;