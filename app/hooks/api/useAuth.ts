import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "~/services/auth.service";
import { authKeys } from "~/constants/api";
import { useNavigate } from "react-router";
import type { LoginFormData } from "~/schemas/auth";
import { logger } from "~/utils/logger";

// Query Hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => {
      const user = authService.getUser();
      if (!user) {
        throw new Error('No user found');
      }
      return { data: user };
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mutation Hooks
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      // Store token
      localStorage.setItem('token', response.data.access_token);

      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), response);

      // Navigate based on user role
      const userRole = response.data.user.role?.key;
      if (userRole === 'manager') {
        navigate('/dashboard/overview');
      } else if (userRole === 'mentor') {
        navigate('/dashboard/mentor/overview');
      } else if (userRole === 'student') {
        navigate('/dashboard/student/my-courses');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      logger.apiError('login', error);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();

      // Navigate to login
      navigate('/login');
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      authService.logout();
      queryClient.clear();
      navigate('/login');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      // Could show success message or navigate to verification page
    },
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: ({ token }: { token: string }) => authService.verifyEmail(token),
    onSuccess: () => {
      // Could show success message
    },
  });
}