import { useQuery } from "@tanstack/react-query";
import { lessonsService } from "~/services/lessons.service";
import { lessonKeys } from "~/constants/api";

// Query Hooks
export function useLesson(id: number | undefined) {
  return useQuery({
    queryKey: lessonKeys.detail(id!),
    queryFn: () => lessonsService.getLessonById(id!),
    enabled: !!id,
  });
}

export function useLessons(filters?: Record<string, any>) {
  return useQuery({
    queryKey: lessonKeys.list(filters || {}),
    queryFn: () => lessonsService.getAllLessons(),
  });
}

export function useLessonsByCourse(courseId: number | undefined) {
  return useQuery({
    queryKey: lessonKeys.byCourse(courseId!),
    queryFn: () => lessonsService.getLessonsByCourse(courseId!),
    enabled: !!courseId,
  });
}

export function useLessonsBySection(sectionId: number | undefined) {
  return useQuery({
    queryKey: lessonKeys.bySection(sectionId!),
    queryFn: () => lessonsService.getLessonsBySection(sectionId!),
    enabled: !!sectionId,
  });
}