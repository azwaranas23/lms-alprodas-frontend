import { useQuery } from "@tanstack/react-query";
import { coursesService } from "~/services/courses.service";
import { courseKeys } from "~/constants/api";

// Query Hooks
export function useCourse(id: number | undefined) {
  return useQuery({
    queryKey: courseKeys.detail(id!),
    queryFn: () => coursesService.getCourseById(id!),
    enabled: !!id,
  });
}

export function useCourses(filters?: Record<string, any>) {
  return useQuery({
    queryKey: courseKeys.list(filters || {}),
    queryFn: () => coursesService.getCourses(filters),
  });
}

export function useCoursesByTopic(topicId: number | undefined) {
  return useQuery({
    queryKey: courseKeys.byTopic(topicId!),
    queryFn: () => coursesService.getCoursesByTopic(topicId!),
    enabled: !!topicId,
  });
}

export function useMostJoinedCourses() {
  return useQuery({
    queryKey: courseKeys.mostJoined(),
    queryFn: () => coursesService.getMostJoinedCourses(),
  });
}

export function useCoursesByMentor(mentorId: number | undefined) {
  return useQuery({
    queryKey: courseKeys.byMentor(mentorId!),
    queryFn: () => coursesService.getCourses(),
    enabled: !!mentorId,
  });
}