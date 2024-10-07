import {FC} from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {PrivateRoutes} from './privateRoutes.tsx'
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {App} from "@/app/App.tsx";
import {PublicRoute} from "@/app/routing/publicRoutes.tsx";

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {BASE_URL} = import.meta.env

const AppRoutes: FC = () => {
    const {currentUser} = useSelector((state: RootState) => state.auth);
    return (
        <BrowserRouter basename={BASE_URL}>
            <Routes>
                <Route element={<App/>}>
                    <Route path='*' element={<PublicRoute/>}/>
                    {currentUser && (
                        <Route path='management/*' element={<PrivateRoutes/>}/>
                    )}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export {AppRoutes}
