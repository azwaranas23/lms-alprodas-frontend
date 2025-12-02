import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { authService } from '~/services/auth.service';
import type { LoginFormData } from '~/schemas/auth';
import type { LoginResponse, AuthError } from '~/types/auth';
import { type AxiosError } from 'axios';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<AuthError>, LoginFormData>({
    mutationFn: (credentials: LoginFormData) => authService.login(credentials),
    onSuccess: (data) => {
      const user = data.data.user;
      const redirectPath = authService.getRedirectPathByRole(user);
      navigate(redirectPath);
    },
    onError: (error) => {
      console.error('Login failed:', error.response?.data?.message || error.message);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      authService.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      navigate('/login');
      // Force page refresh to clear any cached state
      window.location.href = '/login';
    },
  });
};