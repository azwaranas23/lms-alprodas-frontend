import { Download, FileText, FolderOpen } from "lucide-react";
import { useStudentCourseResources } from "~/hooks/api/useCourseResources";
import type { CourseResourceResponse } from "~/services/course-resources.service";

interface CourseResourcesStudentTabProps {
  courseId: number;
}

export function CourseResourcesStudentTab({
  courseId,
}: CourseResourcesStudentTabProps) {
  const { data, isLoading, error } = useStudentCourseResources(courseId);

  const resources: CourseResourceResponse[] = data?.data ?? [];

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(1)} ${units[i]}`;
  };

  const getFileExtension = (resource: CourseResourceResponse) => {
    const name = resource.fileName || "";

    if (name.includes(".")) {
      const ext = name.split(".").pop()?.toLowerCase();
      if (ext && ext.length <= 5) {
        return ext;
      }
    }

    if (resource.resourceType) {
      const parts = resource.resourceType.split("/");
      if (parts.length === 2 && parts[1]) {
        return parts[1].toLowerCase();
      }
    }

    return "-";
  };

  const handleDownload = (resource: CourseResourceResponse) => {
    const normalizedPath = resource.resourcePath.replace(/\\/g, "/");
    const baseUrl = (
      import.meta.env.VITE_API_URL ?? "http://localhost:3005/api"
    ).replace(/\/api\/?$/, "");
    const url = `${baseUrl}/${normalizedPath}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">
        Course Resources
      </h2>

      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-sm">Loading resources...</p>
        </div>
      )}

      {!isLoading && error && (
        <p className="text-sm text-red-600">Failed to load course resources.</p>
      )}

      {!isLoading && !error && resources.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-brand-dark text-xl font-bold mb-2">
            No Course Resources
          </h3>
          <p className="text-brand-light text-base">
            This course does not have any downloadable resources yet.
          </p>
        </div>
      )}

      {!isLoading && !error && resources.length > 0 && (
        <div className="-mx-8 -mb-8">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB]">
                <th className="px-8 py-3 text-left font-semibold text-brand-dark rounded-tl-[20px]">
                  Name
                </th>
                <th className="px-8 py-3 text-left font-semibold text-brand-dark">
                  Type
                </th>
                <th className="px-8 py-3 text-left font-semibold text-brand-dark">
                  Size
                </th>
                <th className="px-8 py-3 text-left font-semibold text-brand-dark rounded-tr-[20px]">
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-8 py-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span>{r.fileName}</span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                      {getFileExtension(r).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-gray-600">
                    {formatSize(r.fileSize)}
                  </td>
                  <td className="px-8 py-4">
                    <button
                      type="button"
                      onClick={() => handleDownload(r)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
