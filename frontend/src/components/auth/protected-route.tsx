import { Navigate, useLocation } from 'react-router-dom';
import { decodeJwtPayload } from '../../lib/utils';

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
    const payload = decodeJwtPayload(token);

    // Verificar expiração
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      localStorage.removeItem('token');
      return <Navigate to="/entrar" state={{ from: location }} replace />;
    }

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
