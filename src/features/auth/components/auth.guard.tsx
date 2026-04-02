import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../auth.hooks";

const AuthGuard = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    
    if (isLoading) return <p>Loading...</p>;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

  return <Outlet />
}

export default AuthGuard