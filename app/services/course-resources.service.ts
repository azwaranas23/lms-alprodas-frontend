import { apiClient } from "~/lib/axios";

export interface CourseResourceResponse {
  id: number;
  courseId: number;
  resourceType: string;
  resourcePath: string;
  fileName: string;
  fileSize: number;
}

export interface BaseResponse<T> {
  message: string;
  data: T;
}

function mapCourseResource(raw: any): CourseResourceResponse {
  return {
    id: raw.id,
    courseId: raw.courseId ?? raw.course_id,
    resourceType: raw.resourceType ?? raw.resource_type,
    resourcePath: raw.resourcePath ?? raw.resource_path,
    fileName: raw.fileName ?? raw.file_name,
    fileSize: raw.fileSize ?? raw.file_size,
  };
}

export async function getCourseResources(
  courseId: number
): Promise<BaseResponse<CourseResourceResponse[]>> {
  const res = await apiClient.get(`/courses/${courseId}/resources`);

  const raw = res.data as BaseResponse<any[]>;
  return {
    message: raw.message,
    data: (raw.data ?? []).map(mapCourseResource),
  };
}

export async function uploadCourseResource(
  courseId: number,
  payload: { name?: string; file: File }
): Promise<BaseResponse<CourseResourceResponse>> {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.name) {
    formData.append("name", payload.name);
  }

  const res = await apiClient.post(`/courses/${courseId}/resources`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const raw = res.data as BaseResponse<any>;
  return {
    message: raw.message,
    data: mapCourseResource(raw.data),
  };
}

export async function deleteCourseResource(
  courseId: number,
  resourceId: number
): Promise<BaseResponse<null>> {
  const res = await apiClient.delete(
    `/courses/${courseId}/resources/${resourceId}`
  );
  return res.data as BaseResponse<null>;
}
