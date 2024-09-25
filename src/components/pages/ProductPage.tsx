import {Navigate, Outlet, Route, Routes} from 'react-router-dom'
import {PageTitle} from "@/_metronic/layout/components/toolbar/page-title/PageTitle.tsx";

const ProductPage = () => (
    // <Routes>
    //     <Route
    //       path='1234'
    //       element={
    //         <HomeWrapper/>
    //       }
    //     />
    //     <Route path='*' element={<Navigate to='/' />} />
    // </Routes>
    <Routes>
        <Route element={<Outlet/>}>

            <Route
                path='overview'
                element={
                    <>
                        <PageTitle/>
                        <Outlet/>
                    </>
                }
            >
                <Route index element={<Navigate to='/crafted/account/overview'/>}/>
            </Route>
        </Route>
    </Routes>
)

export default ProductPage
