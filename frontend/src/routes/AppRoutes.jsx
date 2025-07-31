import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/register";
import Home from "../screens/Home";
import Project from "../screens/Project";
import LandingPage from "../screens/LandingPage";
import ProtectedRoute from "../component/ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={
                  
                        <Home />
                    
                } />
                <Route path="/project" element={
                    <ProtectedRoute>
                        <Project />
                    </ProtectedRoute>
                } />
            </Routes>
            
        </BrowserRouter>
    );
}

export default AppRoutes;