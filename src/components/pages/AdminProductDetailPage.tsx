import { useLocation } from "react-router-dom";
import { ProductForm } from "../molecules/ProductForm";
import { AdminLayout } from "../templates/AdminLayout";
import { useEffect } from "react";

export const AdminProductDetailPage = () => {
    const location = useLocation();

    useEffect(() => {
        console.log(location.pathname);
        
    })

    return (
        <AdminLayout>
            <ProductForm/>
        </AdminLayout>
    );
};