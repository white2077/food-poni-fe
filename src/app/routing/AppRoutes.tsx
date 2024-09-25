import {FC} from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import {PrivateRoutes} from './PrivateRoutes'
import {App} from '../App'
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {PublicRoute} from "@/app/routing/PublicRoutes.tsx";

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {BASE_URL} = import.meta.env

const AppRoutes: FC = () => {
    const {currentUser} = useSelector((state: RootState) => state.user);
    return (
        <BrowserRouter basename={BASE_URL}>
            <Routes>
                <Route element={<App/>}>
                    {currentUser.id && (
                        <>
                            <Route index element={<Navigate to='/dashboard'/>}/>
                            <Route path='management/*' element={<PrivateRoutes/>}/>
                        </>
                    )}
                    <Route path='*' element={<PublicRoute />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export {AppRoutes}
