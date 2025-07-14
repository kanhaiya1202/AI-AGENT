import { Route , BrowserRouter, Router, Routes } from "react-router-dom";

function AppRoutes(){
    return(
        
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<div>Home</div>}></Route>
                    <Route path="/login" element={<div>Login</div>}></Route>
                    <Route path="register" element={<div>Register</div>}></Route>
                </Routes>
            </BrowserRouter>
        
    )
}
export default AppRoutes