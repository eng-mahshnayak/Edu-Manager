import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('schooltoken');

  console.log(token,'=================ProtectedRoute token=========');
  
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  // If token exists, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;