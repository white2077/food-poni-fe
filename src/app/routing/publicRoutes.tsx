import {lazy} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {AuthPage} from "@/app/modules/auth";
import {ErrorsPage} from "@/app/modules/errors/ErrorsPage.tsx";
import HomeWrapper from "@/components/templates/homeWrapper.tsx";
import SuspensedView from "@/components/atoms/suspensedView.tsx";

const PublicRoute = () => {
  const ProductPage = lazy(() => import('@/components/pages/productPage.tsx'))

  return (
    <Routes>
        <Route index element={<HomeWrapper/>}/>
        <Route path='auth/*' element={<AuthPage/>}/>
        <Route
            path='san-pham/*'
            element={
                <SuspensedView>
                    <ProductPage />
                </SuspensedView>
            }
        />
        <Route path='error/*' element={<ErrorsPage/>}/>
        <Route path='*' element={<Navigate to='/'/>}/>
    </Routes>
  )
}

export {PublicRoute}
