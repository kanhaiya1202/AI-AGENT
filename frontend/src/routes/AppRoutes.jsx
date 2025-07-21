import { Route , BrowserRouter, Router, Routes, Link } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/register";
import Home from "../screens/Home";

function AppRoutes(){
    return(
        
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login></Login>}></Route>
                    <Route path="register" element={<Register></Register>}></Route>
                </Routes>
            </BrowserRouter>
        
    )
}

export default AppRoutes