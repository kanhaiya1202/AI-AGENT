import { Route , BrowserRouter, Router, Routes, Link } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/register";

function AppRoutes(){
    return(
        
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<div>Home</div>}></Route>
                    <Route path="/login" element={<Login></Login>}></Route>
                    <Route path="register" element={<Register></Register>}></Route>
                </Routes>
            </BrowserRouter>
        
    )
}

export default AppRoutes