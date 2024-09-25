import {Suspense} from 'react'
import {Outlet} from 'react-router-dom'
import {LayoutProvider, LayoutSplashScreen} from '@/_metronic/layout/core'
import {AuthInit} from './modules/auth'

const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
        <LayoutProvider>
            <AuthInit>
              <Outlet />
            </AuthInit>
        </LayoutProvider>
    </Suspense>
  )
}

export {App}
