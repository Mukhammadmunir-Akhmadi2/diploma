// components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore"; 
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
