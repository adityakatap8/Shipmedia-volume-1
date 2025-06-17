// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../utils/useAuth';
import Loader from '../loader/Loader';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div><Loader /></div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
