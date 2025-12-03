import { useState } from "react";
import { useParams } from "react-router";
import {
  CloudUpload,
  Download,
  FileText,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { Button } from "~/components/atoms/Button";
import {
  useCourseResources,
  useUploadCourseResource,
  useDeleteCourseResource,
} from "~/hooks/api/useCourseResources";
import type { CourseResourceResponse } from "~/services/course-resources.service";

interface ResourcesTabProps {
  course: unknown;
}

export function ResourcesTab({}: ResourcesTabProps) {
  const { id } = useParams();
  const courseId = Number(id);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    data: resourcesData,
    isLoading,
    error: queryError,
  } = useCourseResources(courseId);

  const uploadMutation = useUploadCourseResource(courseId, {
    onSuccess: () => {
      setFile(null);
      setName("");
    },
  });

  const deleteMutation = useDeleteCourseResource(courseId);

  const resources: CourseResourceResponse[] = resourcesData?.data ?? [];
  const errorMessage =
    localError ||
    queryError?.message ||
    uploadMutation.error?.message ||
    deleteMutation.error?.message ||
    null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setFile(null);
      return;
    }

    const allowedExts = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
    ];
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExts.includes(ext)) {
      setLocalError(
        "File type not allowed. Allowed: pdf, doc, docx, xls, xlsx, ppt, pptx, txt"
      );
      e.target.value = "";
      setFile(null);
      return;
    }

    setLocalError(null);
    setFile(f);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLocalError(null);
    uploadMutation.mutate({
      file,
      name: name.trim() || undefined,
    });
  };

  const handleDownload = (resource: CourseResourceResponse) => {
    const normalizedPath = resource.resourcePath.replace(/\\/g, "/");
    // apiClient baseURL: http://localhost:3005/api -> hilangkan /api
    const baseUrl = (
      import.meta.env.VITE_API_URL ?? "http://localhost:3005/api"
    ).replace(/\/api\/?$/, "");
    const url = `${baseUrl}/${normalizedPath}`;
    window.open(url, "_blank");
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }
    setLocalError(null);
    deleteMutation.mutate(id);
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(1)} ${units[i]}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-brand-dark text-2xl font-bold">Course Resources</h2>
      </div>

      {/* Upload Card */}
      <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
            <CloudUpload className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-brand-dark text-lg font-bold">
              Upload Course Resource
            </h3>
            <p className="text-brand-light text-sm">
              Upload supporting documents such as slides, PDFs, worksheets, or
              other course materials.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleUpload}
          className="flex flex-col md:flex-row gap-4 items-start md:items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-brand-dark text-sm font-semibold mb-1">
              Resource Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#DCDEDD] rounded-[12px] px-3 py-2 text-sm focus:outline-none focus:border-[#0C51D9] focus:border-2"
              placeholder="e.g. Week 1 - Introduction Slides"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="block text-brand-dark text-sm font-semibold">
              File (pdf, doc, xls, ppt, txt) *
            </label>
            <div className="flex items-center gap-3">
              {/* Custom file button */}
              <label className="inline-flex items-center gap-2 border border-[#DCDEDD] rounded-[12px] px-4 py-2 text-sm font-semibold text-brand-dark cursor-pointer hover:border-[#0C51D9] hover:border-2 transition-all duration-200 bg-white">
                <CloudUpload className="w-4 h-4 text-blue-600" />
                <span>Choose File</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  className="hidden"
                />
              </label>

              {/* Selected file name */}
              <span className="text-sm text-gray-500 max-w-[220px] truncate">
                {file?.name || "No file chosen"}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!file || uploadMutation.isPending}
            variant="primary"
            className="rounded-[8px] px-6 py-3 flex items-center gap-2"
          >
            <CloudUpload className="w-4 h-4 text-white" />
            <span className="text-brand-white text-sm font-semibold">
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </span>
          </Button>
        </form>

        {errorMessage && (
          <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>

      {/* List / Empty State */}
      <div className="bg-white border border-[#DCDEDD] rounded-[16px] p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-brand-dark text-xl font-bold mb-2">
              No Course Resources
            </h3>
            <p className="text-brand-light text-base">
              Upload documents, slides, and other materials to support your
              course.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-brand-dark">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-dark">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-dark">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-dark">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-[#DCDEDD] hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>{r.fileName}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.resourceType}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatSize(r.fileSize)}
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleDownload(r)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        disabled={
                          deleteMutation.isPending &&
                          deleteMutation.variables === r.id
                        }
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleteMutation.isPending &&
                        deleteMutation.variables === r.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
