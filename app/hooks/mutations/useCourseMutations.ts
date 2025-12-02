import { coursesService } from "~/services/courses.service";
import type { UpdateCourseData } from "~/services/courses.service";
import { courseKeys } from "~/constants/api";
import { useBaseMutation } from "~/hooks/useBaseMutation";
import { useQueryClient } from "@tanstack/react-query";

// Mutation Hooks
export function useCreateCourse() {
  return useBaseMutation({
    mutationFn: coursesService.createCourse,
    invalidateKeys: [courseKeys.lists()],
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCourseData }) =>
      coursesService.updateCourse(id, data),
    onSuccessCallback: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(id) });
    },
    invalidateKeys: [courseKeys.lists()],
  });
}

export function useDeleteCourse() {
  return useBaseMutation({
    mutationFn: coursesService.deleteCourse,
    invalidateKeys: [courseKeys.lists()],
  });
}

export function useUpdateCourseImage() {
  const queryClient = useQueryClient();

  return useBaseMutation({
    mutationFn: ({
      courseId,
      imageType,
      imageFile
    }: {
      courseId: number;
      imageType: 'main' | 'preview' | 'sample' | 'certificate';
      imageFile: File
    }) => coursesService.updateCourseImage(courseId, imageType, imageFile),
    onSuccessCallback: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
    },
    invalidateKeys: [courseKeys.lists()],
  });
}