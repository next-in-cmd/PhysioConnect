import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;