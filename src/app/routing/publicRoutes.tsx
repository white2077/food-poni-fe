import {lazy} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {AuthPage} from "@/app/modules/auth";
import {ErrorsPage} from "@/app/modules/errors/ErrorsPage.tsx";
import HomeWrapper from "@/components/templates/homeWrapper.tsx";
import SuspensedView from "@/components/atoms/suspensedView.tsx";

const PublicRoute = () => {
    const ProductPage = lazy(() => import('@/components/pages/productPage.tsx'))
    const OrderPage = lazy(() => import('@/components/pages/orderPage.tsx'))
    const CheckoutPage = lazy(() => import('@/components/pages/checkoutPage.tsx'))

    return (
        <Routes>
            <Route index element={<HomeWrapper/>}/>
            <Route path='auth/*' element={<AuthPage/>}/>
            <Route
                path='san-pham/*'
                element={
                    <SuspensedView>
                        <ProductPage/>
                    </SuspensedView>
                }
            />
            <Route
                path='checkout'
                element={
                    <SuspensedView>
                        <CheckoutPage/>
                    </SuspensedView>
                }
            />
            <Route
                path='don-hang/*'
                element={
                    <SuspensedView>
                        <OrderPage/>
                    </SuspensedView>
                }
            />
            <Route path='error/*' element={<ErrorsPage/>}/>
            <Route path='*' element={<Navigate to='/'/>}/>
        </Routes>
    )
}

export {PublicRoute}
