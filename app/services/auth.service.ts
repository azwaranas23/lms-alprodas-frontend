import { apiClient } from "~/lib/axios";
import { API_ENDPOINTS } from "~/constants/api";
import type { LoginFormData } from "~/schemas/auth";
import type { LoginResponse, User } from "~/types/auth";

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );

    if (response.data.data?.access_token && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.data.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data;
  },

  async register(
    formData: FormData
  ): Promise<{ message: string; data: { user: User } }> {
    const response = await apiClient.post("auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async verifyEmail(
    token: string
  ): Promise<{ message: string; data: { verified: boolean } }> {
    const response = await apiClient.get(`auth/verify-email?token=${token}`);
    return response.data;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  isAuthenticated() {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },

  getRedirectPathByRole(user: User): string {
    const roleKey = user.role?.key;

    switch (roleKey) {
      case "manager":
        return "/dashboard/overview";
      case "mentor":
        return "/dashboard/mentor/overview";
      case "student":
        return "/dashboard/student/my-courses";
      default:
        return "/dashboard";
    }
  },

  hasPermission(permission: string): boolean {
    if (typeof window === "undefined") return false;
    const user = this.getUser();
    if (!user || !user.role?.permissions) return false;

    return user.role.permissions.some((p) => p.key === permission);
  },

  hasAnyPermission(permissions: string[]): boolean {
    if (typeof window === "undefined") return false;
    return permissions.some((permission) => this.hasPermission(permission));
  },

  getUserPermissions(): string[] {
    if (typeof window === "undefined") return [];
    const user = this.getUser();
    if (!user || !user.role?.permissions) return [];

    return user.role.permissions.map((p) => p.key);
  },
};
