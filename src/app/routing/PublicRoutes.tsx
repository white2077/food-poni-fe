import {FC, lazy, Suspense} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import TopBarProgress from 'react-topbar-progress-indicator'
import {getCSSVariableValue} from '@/_metronic/assets/ts/_utils'
import {WithChildren} from '@/_metronic/helpers'
import {AuthPage} from "@/app/modules/auth";
import {ErrorsPage} from "@/app/modules/errors/ErrorsPage.tsx";
import HomeWrapper from "@/components/templates/HomeWrapper.tsx";
import CheckoutWrapper from "@/components/templates/CheckoutWrapper.tsx";

const PublicRoute = () => {
  const ProductPage = lazy(() => import('@/components/pages/ProductPage'))

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
        <Route
            path='checkout'
            element={
                <SuspensedView>
                    <CheckoutWrapper />
                </SuspensedView>
            }
        />
        <Route path='error/*' element={<ErrorsPage/>}/>
        <Route path='*' element={<Navigate to='/'/>}/>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PublicRoute}
