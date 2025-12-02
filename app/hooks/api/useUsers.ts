import { useQuery } from "@tanstack/react-query";
import { usersService } from "~/services/users.service";
import { userKeys } from "~/constants/api";
import type { UserFilters } from "~/types/api-filters";

// Query Hooks
export function useUser(id: number | undefined) {
	return useQuery({
		queryKey: userKeys.detail(id!),
		queryFn: () => usersService.getUserById(id!),
		enabled: !!id,
	});
}

export function useUsers(
	role: "mentors" | "students",
	filters?: UserFilters
) {
	return useQuery({
		queryKey: [...userKeys.byRole(role), filters],
		queryFn: () => usersService.getUsers(role, filters),
	});
}

export function useMentors(filters?: UserFilters) {
	return useUsers("mentors", filters);
}

export function useStudents(filters?: UserFilters) {
	return useUsers("students", filters);
}
