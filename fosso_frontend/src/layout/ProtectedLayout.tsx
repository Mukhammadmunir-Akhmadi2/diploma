import { Outlet, Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore"

function ProtectedLayout() {
  const user = useAuthStore((state) => state.user);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
  return <Outlet />;
}

export default ProtectedLayout;
