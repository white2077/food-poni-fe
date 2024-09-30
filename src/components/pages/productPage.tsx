import {Navigate, Route, Routes} from 'react-router-dom'
import ProductWrapper from "@/components/templates/productWrapper.tsx";
import {DefaultLayout} from "@/app/pages/_layout.tsx";

export default function productPage() {
    return <Routes>
        <Route element={<DefaultLayout/>}>
            <Route
                path=':pathVariable'
                element={<ProductWrapper/>}
            />
        </Route>
        <Route path="*" element={<Navigate to='/'/>}/>
    </Routes>
}
