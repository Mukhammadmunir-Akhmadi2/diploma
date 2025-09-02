// components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
import type { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAppSelector((state) => state.auth.token);

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
