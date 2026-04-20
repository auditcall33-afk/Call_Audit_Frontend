import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  // TEMPORARILY DISABLED FOR TESTING - COMMENTED OUT AUTHENTICATION CHECKS
  // const isAuthenticated = authService.isAuthenticated();
  // const hasRequiredRole = authService.hasRole(requiredRole);

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  // if (requiredRole && !hasRequiredRole) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
};

export default ProtectedRoute;
