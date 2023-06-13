import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import "./Protected.scss";

// Protected page for route security

const Protected = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("auth_code");
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default Protected;
