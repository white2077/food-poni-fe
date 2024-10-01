import {Navigate, Route, Routes} from 'react-router-dom'
import {DefaultLayout} from "@/app/pages/_layout.tsx";
import CheckoutWrapper from "@/components/templates/checkoutWrapper.tsx";

export default function checkoutPage() {
    return <Routes>
        <Route element={<DefaultLayout/>}>
            <Route
                path='/'
                element={<CheckoutWrapper/>}
            />
        </Route>
        <Route path="*" element={<Navigate to='/'/>}/>
    </Routes>
}
