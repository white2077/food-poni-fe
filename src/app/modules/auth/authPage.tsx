import {Navigate, Route, Routes} from 'react-router-dom'
import {Login} from "@/app/modules/auth/components/login.tsx";

const AuthPage = () => (
    <Routes>
        <Route path='login' element={<Login/>}/>
        <Route path='registration' element={<Login/>}/>
        <Route path='forgot-password' element={<Login/>}/>
        <Route path='*' element={<Navigate to='/auth/login'/>}/>
    </Routes>
)

export {AuthPage}
