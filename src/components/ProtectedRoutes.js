import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  if (localStorage.getItem("userId")) {
    return <div>{children}</div>;
  } else {
    return <Navigate to="/login"></Navigate>;
  }
}
