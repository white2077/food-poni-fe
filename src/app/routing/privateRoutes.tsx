import {Navigate, Route, Routes} from 'react-router-dom'
import {DefaultLayout} from "@/app/pages/_layout.tsx";
import SuspensedView from "@/components/atoms/suspensedView.tsx";
import {lazy} from "react";


const PrivateRoutes = () => {
    const OrderPage = lazy(() => import('@/components/pages/orderPage.tsx'))
    const PersonalInformation = lazy(() => import('@/components/personal-information.tsx'))


    return (
        <Routes>
            <Route element={<DefaultLayout/>}>
                <Route path='auth/*' element={<Navigate to='/'/>}/>
                {/* Pages */}
                {/*<Route path='dashboard' element={<DashboardWrapper />} />*/}
                {/* Lazy Modules */}
                <Route
                    path='thong-tin-tai-khoan'
                    element={
                        <SuspensedView>
                            <PersonalInformation/>
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
                {/* Page Not Found */}
                <Route path='*' element={<Navigate to='/error/404'/>}/>
            </Route>
        </Routes>
    )
}

export {PrivateRoutes}
