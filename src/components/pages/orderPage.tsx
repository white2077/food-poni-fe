import {Navigate, Route, Routes} from 'react-router-dom'
import ProductWrapper from "@/components/templates/productWrapper.tsx";
import {DefaultLayout} from "@/app/pages/_layout.tsx";
import OrderWrapper from "@/components/templates/orderWrapper.tsx";

export default function orderPage() {
    return <Routes>
        <Route element={<DefaultLayout/>}>
            <Route
                path='/'
                element={<OrderWrapper/>}
            />
            <Route
                path=':id'
                element={<ProductWrapper/>}
            />
        </Route>
        <Route path="*" element={<Navigate to='/'/>}/>
    </Routes>
}
