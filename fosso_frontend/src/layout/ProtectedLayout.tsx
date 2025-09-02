import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";

function ProtectedLayout() {
  const user = useAppSelector((state) => state.auth.user);
    if (!user) {
        return <Navigate to="/login" replace />;
    }
  return <Outlet />;
}

export default ProtectedLayout;
