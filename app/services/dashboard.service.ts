import { apiClient } from '../lib/axios';
import { API_ENDPOINTS } from '../constants/api';

export interface DashboardStats {
  totalRevenue: {
    amount: string;
    percentage: string;
    period: string;
  };
  activeCourses: {
    count: number;
    newCount: number;
  };
  activeLearners: {
    count: number;
    newCount: number;
  };
  completedTransactions: {
    count: number;
    monthlyCount: number;
  };
  activeMentors: {
    count: number;
    newCount: number;
  };
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  image: string;
  status: string;
  type: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  type: string;
}

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.stats);
    return response.data.data;
  },

  // Get latest transactions
  getLatestTransactions: async () => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.transactions);
    return response.data.data;
  },

  // Get latest users
  getLatestUsers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.users);
    return response.data.data;
  },

  // Get latest courses
  getLatestCourses: async () => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.courses);
    return response.data.data;
  },
};