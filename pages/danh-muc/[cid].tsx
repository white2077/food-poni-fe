import { ParsedUrlQuery } from "querystring";
import { getProductsCardPageByCategory } from "../../queries/product.query";
import { getCategoriesPage } from "../../queries/product_category.query";
import { Page } from "../../models/Page";
import { IProductCard } from "../../components/product-rows";
import { ProductCategoryAPIResponse } from "../../models/product_category/ProductCategoryAPIResponse";
import { SidebarLayout } from "../_layout";
import ProductCategory from "../../components/product-category";
import { Card, Col, Row, Rate, Typography, Pagination } from 'antd';
import Link from 'next/link';
import { server } from "../../utils/server";
import { useState } from "react";
import ProductCard from "../../components/product-card";

const { Text, Title } = Typography;

export async function getServerSideProps(context: { params: ParsedUrlQuery }) {
    const { cid } = context.params;

    if (typeof cid !== 'string') {
        throw new Error('Invalid category ID');
    }

    try {
        const [productsPage, categoriesPage] = await Promise.all([
            getProductsCardPageByCategory(cid, { page: 0, pageSize: 12, status: true }),
            getCategoriesPage({ page: 0, pageSize: 100 })
        ]);

        return { props: { productsPage, categoriesPage, categoryId: cid } };
    } catch (e) {
        console.error("Error fetching data:", e);
        return { props: { error: "Failed to load data" } };
    }
}

interface ProductsCategoryProps {
    productsPage: Page<IProductCard[]>;
    categoriesPage: Page<ProductCategoryAPIResponse[]>;
    categoryId: string;
    error?: string;
}

export default function ProductsCategory({ productsPage, categoriesPage, categoryId, error }: ProductsCategoryProps) {
    const [currentPage, setCurrentPage] = useState(1);

    if (error) {
        return <div className="text-center text-red-500 text-xl mt-10">{error}</div>;
    }

    const sidebarContents = [
        <ProductCategory key={0} categoryList={categoriesPage.content} />,
        <img key={1} className='rounded-md w-full mt-4'
            src={server + '/upload/vertical-banner.png'} alt="Promotional banner" />
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <SidebarLayout sidebarContents={sidebarContents}>
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Sản phẩm trong danh mục</h1>
                <Row gutter={[16, 24]}>
                    {productsPage.content.map((product: IProductCard) => (
                        <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                            <ProductCard key={product.id} product={product} />
                        </Col>
                    ))}
                </Row>
                <div className="mt-8 flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={productsPage.totalElements}
                        pageSize={12}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        </SidebarLayout>
    );
}