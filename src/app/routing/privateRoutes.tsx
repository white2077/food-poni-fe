import {lazy} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {DefaultLayout} from "@/app/pages/_layout.tsx";
import SuspensedView from "@/components/atoms/suspensedView.tsx";

const PrivateRoutes = () => {
    const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
    const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
    const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
    const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
    const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
    const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

    return (
        <Routes>
            <Route element={<DefaultLayout/>}>
                {/* Redirect to Dashboard after success login/registartion */}
                <Route path='auth/*' element={<Navigate to='/'/>}/>
                {/* Pages */}
                {/*<Route path='dashboard' element={<DashboardWrapper />} />*/}
                {/* Lazy Modules */}
                <Route
                    path='crafted/pages/profile/*'
                    element={
                        <SuspensedView>
                            <ProfilePage/>
                        </SuspensedView>
                    }
                />
                <Route
                    path='crafted/pages/wizards/*'
                    element={
                        <SuspensedView>
                            <WizardsPage/>
                        </SuspensedView>
                    }
                />
                <Route
                    path='crafted/widgets/*'
                    element={
                        <SuspensedView>
                            <WidgetsPage/>
                        </SuspensedView>
                    }
                />
                <Route
                    path='crafted/account/*'
                    element={
                        <SuspensedView>
                            <AccountPage/>
                        </SuspensedView>
                    }
                />
                <Route
                    path='apps/chat/*'
                    element={
                        <SuspensedView>
                            <ChatPage/>
                        </SuspensedView>
                    }
                />
                <Route
                    path='apps/user-management/*'
                    element={
                        <SuspensedView>
                            <UsersPage/>
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
