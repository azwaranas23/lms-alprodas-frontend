import { type ReactNode } from 'react';
import { ProtectedRoute } from './ProtectedRoute';

interface RoleBasedRouteProps {
  children: ReactNode;
  role: 'manager' | 'mentor' | 'student';
}

// Wrapper components for each role
export function ManagerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['manager']}>
      {children}
    </ProtectedRoute>
  );
}

export function MentorRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['mentor']}>
      {children}
    </ProtectedRoute>
  );
}

export function StudentRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      {children}
    </ProtectedRoute>
  );
}

// General protected route for any authenticated user
export function AuthenticatedRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}