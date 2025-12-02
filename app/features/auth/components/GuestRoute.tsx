import { type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '~/services/auth.service';

interface GuestRouteProps {
  children: ReactNode;
}

/**
 * GuestRoute component that only allows unauthenticated users
 * Redirects to appropriate dashboard if user is already logged in
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to their dashboard
    if (authService.isAuthenticated()) {
      const user = authService.getUser();
      if (user) {
        const redirectPath = authService.getRedirectPathByRole(user);
        navigate(redirectPath);
      } else {
        // Fallback to overview if user data is not available
        navigate('/overview');
      }
    }
  }, [navigate]);

  // Don't render anything while checking authentication
  if (authService.isAuthenticated()) {
    return null;
  }

  // Render children only if user is not authenticated
  return <>{children}</>;
}