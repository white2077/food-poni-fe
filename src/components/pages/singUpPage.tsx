import { Route, Routes } from "react-router-dom";
import SignUpWrapper from "../templates/singUpWrapper";



export default function singUpPage() {
    
    return (
        <Routes>
            <Route path="/" element={<SignUpWrapper />} />
        </Routes>
    );
}