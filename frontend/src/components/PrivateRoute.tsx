import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 