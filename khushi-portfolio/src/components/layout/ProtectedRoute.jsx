import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const session = localStorage.getItem('currentUser');
  
  if (!session) {
    // If not logged in, redirect to Home
    // In a real app, you might want to redirect to a /login route 
    // or pass state to open the modal on Home.
    return <Navigate to="/" replace />;
  }

  // If logged in, render the child routes (Outlet)
  // This allows <ProtectedRoute><Child /></ProtectedRoute> nesting in Route definitions
  return <Outlet />;
};

export default ProtectedRoute;
