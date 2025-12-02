import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonsService } from "~/services/lessons.service";
import { lessonKeys, sectionKeys } from "~/constants/api";
import type { CreateLessonRequest, UpdateLessonRequest } from "~/services/lessons.service";

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

// Mutation Hooks
export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonRequest) => lessonsService.createLesson(data),
    onSuccess: (_, data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
      if (data.section_id) {
        queryClient.invalidateQueries({
          queryKey: lessonKeys.bySection(data.section_id)
        });
      }
      // Invalidate sections to update total_lessons count
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
    },
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLessonRequest }) =>
      lessonsService.updateLesson(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
      // Also invalidate section-specific queries
      queryClient.invalidateQueries({
        queryKey: [...lessonKeys.all, 'section']
      });
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => lessonsService.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...lessonKeys.all, 'section']
      });
      // Invalidate sections to update total_lessons count
      queryClient.invalidateQueries({ queryKey: sectionKeys.lists() });
    },
  });
}