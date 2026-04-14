import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }
};
