import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { currentUser } = useAuth(); // Get the current user from context

  if (!currentUser) {
    // If the user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child component (i.e., the protected page)
  return children;
};

export default PrivateRoute;
