import { Navigate, Route, Routes } from 'react-router-dom'
import { DefaultLayout } from "@/app/pages/_layout.tsx";
import OrderWrapper from "@/components/templates/orderWrapper.tsx";
import OrderDetail from '../templates/orderDetailWrapper';



export default function orderPage() {
    return <Routes>
        <Route element={<DefaultLayout />}>
            <Route
                path='/'
                element={<OrderWrapper />}
            />
            <Route
                path=':orderId'
                element={<OrderDetail />}
            />
        </Route>
        <Route path="*" element={<Navigate to='/' />} />
    </Routes>
}
