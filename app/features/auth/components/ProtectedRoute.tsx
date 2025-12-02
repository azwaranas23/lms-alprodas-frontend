import { type ReactNode, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '~/services/auth.service';
import type { UserRole } from '~/types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[]; // optional role-based access control
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();

  // Memoize the allowedRoles to prevent infinite loops
  const memoizedRoles = useMemo(() => allowedRoles?.join(',') || '', [allowedRoles?.join(',')]);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // If specific roles are required, check user role
    if (allowedRoles && allowedRoles.length > 0) {
      const user = authService.getUser();
      const userRole = user?.role?.key;

      if (!userRole || !allowedRoles.includes(userRole)) {
        // Don't redirect if already on the user's default dashboard to avoid infinite loop
        const redirectPath = user ? authService.getRedirectPathByRole(user) : '/login';

        // Only navigate if we're not already on the redirect path
        if (window.location.pathname !== redirectPath) {
          navigate(redirectPath);
        }
        return;
      }
    }
  }, [navigate, memoizedRoles]);

  // Don't render anything while checking authentication
  if (!authService.isAuthenticated()) {
    return null;
  }

  // If roles are specified, check them
  if (allowedRoles && allowedRoles.length > 0) {
    const user = authService.getUser();
    const userRole = user?.role?.key;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}