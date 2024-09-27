import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole?: string; // Optional prop to specify required role (e.g., "admin")
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, role } = useAuth(); // Get the current user and role from context

  if (!currentUser) {
    // If the user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    // If the user doesn't have the required role, redirect to a "Not Authorized" page or home
    return <Navigate to="/not-authorized" />;
  }

  // If authenticated and has the correct role (if required), render the child component
  return children;
};

export default PrivateRoute;
