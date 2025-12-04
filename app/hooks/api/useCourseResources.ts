import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourseResources,
  getStudentCourseResources,
  uploadCourseResource,
  deleteCourseResource,
  type CourseResourceResponse,
  type BaseResponse,
} from "~/services/course-resources.service";

// HOOK UNTUK MENTOR (dashboard)
export function useCourseResources(courseId: number) {
  return useQuery({
    queryKey: ["courseResources", courseId],
    queryFn: () => getCourseResources(courseId),
    enabled: !!courseId,
  });
}

// HOOK UNTUK STUDENT (halaman /course/:id)
export function useStudentCourseResources(courseId: number) {
  return useQuery({
    queryKey: ["studentCourseResources", courseId],
    queryFn: () => getStudentCourseResources(courseId),
    enabled: !!courseId,
  });
}

// UPLOAD – dipakai mentor
export function useUploadCourseResource(
  courseId: number,
  options?: { onSuccess?: (data: BaseResponse<CourseResourceResponse>) => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name?: string; file: File }) =>
      uploadCourseResource(courseId, payload),
    onSuccess: (data, variables, context) => {
      // refresh data di dashboard & student
      queryClient.invalidateQueries({
        queryKey: ["courseResources", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["studentCourseResources", courseId],
      });

      options?.onSuccess?.(data);
    },
  });
}

// DELETE – dipakai mentor
export function useDeleteCourseResource(
  courseId: number,
  options?: { onSuccess?: () => void }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCourseResource(courseId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courseResources", courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["studentCourseResources", courseId],
      });

      options?.onSuccess?.();
    },
  });
}
