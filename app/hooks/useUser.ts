import { authService } from "~/services/auth.service";
import type { User } from "~/types/auth";

export function useUser() {
	const user = authService.getUser();

	const getFirstName = () => {
		return user?.name?.split(" ")[0] || "User";
	};

	const getFullName = () => {
		return user?.name || "User";
	};

	const getEmail = () => {
		return user?.email || "";
	};

	const getRole = () => {
		return user?.role?.key || "";
	};

	const getRoleName = () => {
		return user?.role?.name || "";
	};

	const getAvatar = () => {
		return user?.user_profile?.avatar || user?.avatar || undefined;
	};

	const hasPermission = (permission: string) => {
		return authService.hasPermission(permission);
	};

	const hasAnyPermission = (permissions: string[]) => {
		return authService.hasAnyPermission(permissions);
	};

	const isAuthenticated = () => {
		return authService.isAuthenticated();
	};

	const getExpertise = () => {
		return user?.user_profile?.expertise || "Expert";
	};

	const getTotalCourses = () => {
		return user?.total_courses || 0;
	};

	const getTotalStudents = () => {
		return user?.total_students || 0;
	};

	return {
		user,
		getFirstName,
		getFullName,
		getEmail,
		getRole,
		getRoleName,
		getAvatar,
		getExpertise,
		getTotalCourses,
		getTotalStudents,
		hasPermission,
		hasAnyPermission,
		isAuthenticated,
	};
}
