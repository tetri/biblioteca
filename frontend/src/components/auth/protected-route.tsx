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

  let redirectTo: string | null = null;
  let redirectState: object | null = null;

  try {
    const payload = decodeJwtPayload(token);
    // eslint-disable-next-line react-hooks/purity
    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp as number | undefined;

    if (exp && exp < now) {
      localStorage.removeItem('token');
      redirectTo = '/entrar';
      redirectState = { from: location };
    } else {
      const userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string | undefined;

      if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
        redirectTo = '/';
      }
    }
  } catch {
    localStorage.removeItem('token');
    redirectTo = '/entrar';
    redirectState = { from: location };
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} state={redirectState} replace />;
  }

  return <>{children}</>;
};
