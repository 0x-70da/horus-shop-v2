import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../auth.hooks";

const AuthGuard = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

  return <Outlet />
}

export default AuthGuard 