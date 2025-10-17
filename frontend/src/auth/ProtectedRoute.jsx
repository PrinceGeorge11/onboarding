import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute() {
  const { user, ready } = useAuth();
  const loc = useLocation();
  if (!ready) return <div className="p-6 text-center text-black/70">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <Outlet />;
}
