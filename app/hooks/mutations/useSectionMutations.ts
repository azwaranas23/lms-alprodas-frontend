import { sectionsService } from "~/services/sections.service";
import type {
  CreateSectionRequest,
  UpdateSectionRequest,
  SectionResponse,
} from "~/services/sections.service";
import { sectionKeys } from "~/constants/api";
import { useBaseMutation } from "~/hooks/useBaseMutation";
import { useQueryClient } from "@tanstack/react-query";
import { logger } from "~/utils/logger";

export function useCreateSection(options?: {
  onSuccess?: (data: SectionResponse) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: (data: CreateSectionRequest) => sectionsService.createSection(data),
    onSuccessCallback: (response, data) => {
      if (data.course_id) {
        queryClient.invalidateQueries({
          queryKey: sectionKeys.byCourse(data.course_id)
        });
      }
      options?.onSuccess?.(response);
    },
    onErrorCallback: (error) => {
      logger.apiError('createSection', error);
      options?.onError?.(error as Error);
    },
    invalidateKeys: [sectionKeys.lists()],
  });
}

export function useUpdateSection(options?: {
  onSuccess?: (data: SectionResponse) => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSectionRequest }) =>
      sectionsService.updateSection(id, data),
    onSuccessCallback: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: sectionKeys.detail(id) });

      // Use the response to get the course_id
      const courseId = response?.data?.course_id;
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: sectionKeys.byCourse(courseId)
        });
      }

      options?.onSuccess?.(response);
    },
    onErrorCallback: (error) => {
      logger.apiError('updateSection', error);
      options?.onError?.(error as Error);
    },
    invalidateKeys: [sectionKeys.lists()],
  });
}

export function useDeleteSection(courseId?: number, options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: (id: number) => sectionsService.deleteSection(id),
    onSuccessCallback: () => {
      // Invalidate course-specific section queries
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: sectionKeys.byCourse(courseId)
        });
      } else {
        // Fallback: invalidate all course-specific queries
        queryClient.invalidateQueries({
          queryKey: [...sectionKeys.all, 'course']
        });
      }

      options?.onSuccess?.();
    },
    onErrorCallback: (error) => {
      logger.apiError('deleteSection', error);
      options?.onError?.(error as Error);
    },
    invalidateKeys: [sectionKeys.lists()],
  });
}