import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lessonsService } from "~/services/lessons.service";
import { lessonKeys } from "~/constants/api";
import type { CreateLessonRequest, UpdateLessonRequest } from "~/services/lessons.service";

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
    },
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lessonsService.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}