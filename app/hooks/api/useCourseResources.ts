import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCourseResources,
  uploadCourseResource,
  deleteCourseResource,
  type CourseResourceResponse,
  type BaseResponse,
} from "~/services/course-resources.service";

export function useCourseResources(courseId: number) {
  return useQuery<BaseResponse<CourseResourceResponse[]>, Error>({
    queryKey: ["course-resources", courseId],
    queryFn: () => getCourseResources(courseId),
    enabled: !!courseId,
  });
}

interface UploadPayload {
  name?: string;
  file: File;
}

export function useUploadCourseResource(
  courseId: number,
  options?: {
    onSuccess?: (
      data: BaseResponse<CourseResourceResponse>,
      variables: UploadPayload
    ) => void;
    onError?: (error: Error) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation<
    BaseResponse<CourseResourceResponse>,
    Error,
    UploadPayload
  >({
    mutationKey: ["course-resources-upload", courseId],
    mutationFn: (payload) => uploadCourseResource(courseId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-resources", courseId],
      });
      options?.onSuccess?.(data, variables);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}

export function useDeleteCourseResource(
  courseId: number,
  options?: {
    onSuccess?: (data: BaseResponse<null>, id: number) => void;
    onError?: (error: Error) => void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation<BaseResponse<null>, Error, number>({
    mutationKey: ["course-resources-delete", courseId],
    mutationFn: (id) => deleteCourseResource(courseId, id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ["course-resources", courseId],
      });
      options?.onSuccess?.(data, id);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
