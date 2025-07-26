import { Route , BrowserRouter, Router, Routes, Link } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/register";
import Home from "../screens/Home";
import Project from "../screens/Project";

function AppRoutes(){
    return(
        
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/login" element={<Login></Login>}></Route>
                    <Route path="/register" element={<Register></Register>}></Route>
                    <Route path="/Project" element={<Project></Project>}></Route>
                </Routes>
            </BrowserRouter>
        
    )
}

export default AppRoutes