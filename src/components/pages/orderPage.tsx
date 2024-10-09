import {Route, Routes} from 'react-router-dom'
import OrderWrapper from "@/components/templates/orderWrapper.tsx";
import OrderDetail from '../templates/orderDetailWrapper';


export default function orderPage() {
    return <Routes>
            <Route
                path='/'
                element={<OrderWrapper />}
            />
            <Route
                path=':orderId'
                element={<OrderDetail />}
            />
    </Routes>
}
