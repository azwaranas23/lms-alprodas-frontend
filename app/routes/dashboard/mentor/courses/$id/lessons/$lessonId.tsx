import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "~/components/templates/Layout";
import { Header } from "~/components/templates/Header";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import {
  BookOpen,
  ArrowLeft,
  Edit,
  Video,
  FileText,
  Clock,
} from "lucide-react";
import { lessonsService } from "~/services/lessons.service";
import { coursesService } from "~/services/courses.service";

export function meta() {
  return [
    { title: "Lesson Details - Alprodas LMS" },
    { name: "description", content: "View lesson details and content" },
  ];
}

export default function LessonDetail() {
  const { id, lessonId } = useParams();

  const {
    data: lessonData,
    isLoading: lessonLoading,
    error: lessonError,
  } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonsService.getLessonById(Number(lessonId)),
    enabled: !!lessonId,
  });

  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesService.getCourseById(Number(id)),
    enabled: !!id,
  });

  const lesson = lessonData?.data;
  const course = courseData?.data;

  if (lessonLoading || courseLoading) {
    return (
      <PermissionRoute>
        <Layout>
          <Header title="Loading..." subtitle="Please wait" />
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading lesson details...</p>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  if (lessonError || !lesson) {
    return (
      <PermissionRoute>
        <Layout>
          <Header title="Error" subtitle="Failed to load lesson" />
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Failed to load lesson
                </h3>
                <p className="text-gray-500">
                  The lesson could not be loaded. Please try again later.
                </p>
                <Link
                  to={`/dashboard/mentor/courses/${id}/lessons`}
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to lessons
                </Link>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute>
      <Layout>
        <Header
          title="Lesson Details"
          subtitle="View lesson content and information"
          backButton={{
            onClick: () => window.history.back(),
            label: "Back to Lessons",
          }}
        />
        <main className="main-content flex-1 overflow-auto p-5">
          {/* Course Header */}
          {course && (
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 relative overflow-hidden rounded-[16px]">
                    {course.images?.[0]?.image_path ? (
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}/${course.images[0].image_path}`}
                        alt="Course Thumbnail"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextElementSibling) {
                            (
                              e.currentTarget.nextElementSibling as HTMLElement
                            ).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold text-3xl"
                      style={{
                        display: course.images?.[0]?.image_path
                          ? "none"
                          : "flex",
                      }}
                    >
                      {course.title.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-brand-dark text-2xl font-extrabold mb-2">
                    {course.title}
                  </h1>
                  <p className="text-brand-light text-base">
                    Course lesson content and details
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Details */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                  {lesson.content_type === "VIDEO" ? (
                    <Video className="w-6 h-6 text-blue-600" />
                  ) : (
                    <FileText className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-brand-dark text-xl font-bold">
                    {lesson.title}
                  </h2>
                  <p className="text-brand-light text-sm">
                    Lesson No. {lesson.order_index}
                  </p>
                </div>
              </div>
              <Link
                to={`/dashboard/mentor/courses/${id}/lessons/${lessonId}/edit`}
                className="btn-primary rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center gap-2"
              >
                <Edit className="w-4 h-4 text-white" />
                <span className="text-brand-white text-sm font-semibold">
                  Edit Lesson
                </span>
              </Link>
            </div>

            {/* Lesson Metadata */}
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-brand-dark text-base font-bold">
                  {lesson.duration_minutes || 0} min
                </span>
              </div>
              <span className="px-3 py-1 rounded-md text-sm font-semibold bg-blue-50 text-blue-700">
                {lesson.content_type === "VIDEO" ? "Video" : "Article"}
              </span>
            </div>

            {/* Lesson Content */}
            <div className="border-t border-[#DCDEDD] pt-6">
              {lesson.content_type === "VIDEO" && lesson.content_url && (
                <div className="mb-6">
                  <h3 className="text-brand-dark text-lg font-bold mb-3">
                    Video Content
                  </h3>
                  <div className="bg-gray-50 rounded-[12px] p-4">
                    <p className="text-brand-dark text-base">
                      <strong>Video URL:</strong> {lesson.content_url}
                    </p>
                  </div>
                </div>
              )}

              {lesson.content_text && (
                <div>
                  <h3 className="text-brand-dark text-lg font-bold mb-3">
                    Lesson Content
                  </h3>
                  <div
                    className="prose max-w-none text-brand-dark"
                    dangerouslySetInnerHTML={{ __html: lesson.content_text }}
                  />
                </div>
              )}

              {!lesson.content_url && !lesson.content_text && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No content available for this lesson
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </Layout>
    </PermissionRoute>
  );
}
