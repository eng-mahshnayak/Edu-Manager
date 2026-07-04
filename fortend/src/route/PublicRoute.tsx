import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute: React.FC = () => {
  const token = localStorage.getItem('erptoken');
  
  // If token exists, redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If no token, render the child routes (login, signup, etc.)
  return <Outlet />;
};

export default PublicRoute;