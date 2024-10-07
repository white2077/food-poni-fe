import {Navigate, Route, Routes} from 'react-router-dom'
import {DefaultLayout} from "@/app/pages/_layout.tsx";

const PrivateRoutes = () => {
    // const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))

    return (
        <Routes>
            <Route element={<DefaultLayout/>}>
                <Route path='auth/*' element={<Navigate to='/'/>}/>

                <Route path='*' element={<Navigate to='/error/404'/>}/>
            </Route>
        </Routes>
    )
}

export {PrivateRoutes}
