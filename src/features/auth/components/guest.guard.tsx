import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth.hooks";


const GuestGuard = () => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return <p>Loading...</p>;

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

  return <Outlet />
}

export default GuestGuard