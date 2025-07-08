import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute(){
    const isLoggedIn = sessionStorage.getItem("AToken");
    return isLoggedIn? <Outlet /> : <Navigate to="/login"/>
}

export default ProtectedRoute