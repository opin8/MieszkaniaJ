// ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./api"; // Assuming this function checks if a user is logged in

const ProtectedRoute = () => {
    const authenticated = isAuthenticated();

    if (!authenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;