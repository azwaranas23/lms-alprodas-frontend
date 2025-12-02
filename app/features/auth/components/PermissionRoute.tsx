import { type ReactNode, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '~/services/auth.service';

interface PermissionRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean; // true = needs ALL permissions, false = needs ANY permission
}

export function PermissionRoute({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = false
}: PermissionRouteProps) {
  const navigate = useNavigate();

  // Memoize permissions to prevent infinite loops
  const memoizedPermissions = useMemo(
    () => requiredPermissions?.join(',') || '',
    [requiredPermissions?.join(',')]
  );

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Check permissions
    const user = authService.getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    // If single permission is required
    if (requiredPermission && !authService.hasPermission(requiredPermission)) {
      // Redirect to appropriate dashboard based on user's role
      const redirectPath = authService.getRedirectPathByRole(user);

      // Only navigate if we're not already on the redirect path to avoid infinite loop
      if (window.location.pathname !== redirectPath) {
        navigate(redirectPath);
      }
      return;
    }

    // If multiple permissions are required
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAccess = requireAll
        ? requiredPermissions.every(permission => authService.hasPermission(permission))
        : authService.hasAnyPermission(requiredPermissions);

      if (!hasAccess) {
        // Redirect to appropriate dashboard based on user's role
        const redirectPath = authService.getRedirectPathByRole(user);

        // Only navigate if we're not already on the redirect path to avoid infinite loop
        if (window.location.pathname !== redirectPath) {
          navigate(redirectPath);
        }
        return;
      }
    }
  }, [navigate, requiredPermission, memoizedPermissions, requireAll]);

  // Don't render anything while checking authentication
  if (!authService.isAuthenticated()) {
    return null;
  }

  // Check permissions before rendering
  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    return null;
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? requiredPermissions.every(permission => authService.hasPermission(permission))
      : authService.hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
}