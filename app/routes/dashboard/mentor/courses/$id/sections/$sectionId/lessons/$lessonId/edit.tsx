import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "~/components/templates/Layout";
import { Header } from "~/components/templates/Header";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Video,
  FileText,
  Clock,
  Layers,
  Users,
  Calendar,
  PlayCircle,
  Edit3,
  Type,
  Youtube,
  Link,
} from "lucide-react";
import {
  lessonsService,
  type UpdateLessonRequest,
} from "~/services/lessons.service";
import { coursesService } from "~/services/courses.service";
import { sectionsService } from "~/services/sections.service";
import { RichTextEditor } from "~/components/organisms/RichTextEditor";
import { QUERY_KEYS } from "~/constants/api";
import { Button } from "~/components/atoms/Button";

export function meta() {
  return [
    { title: "Edit Lesson - LMS Alprodas" },
    { name: "description", content: "Edit lesson content and details" },
  ];
}

type LessonType = "VIDEO" | "ARTICLE";

interface LessonFormData {
  title: string;
  type: LessonType;
  duration_minutes: number;
  content_url?: string;
  content_text?: string;
}

export default function EditLesson() {
  const { id, sectionId, lessonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    type: "VIDEO",
    duration_minutes: 0,
    content_url: "",
    content_text: "",
  });

  // Fetch lesson details
  const {
    data: lessonData,
    isLoading: lessonLoading,
    error: lessonError,
  } = useQuery({
    queryKey: [...QUERY_KEYS.lessons, lessonId],
    queryFn: () => lessonsService.getLessonById(Number(lessonId)),
    enabled: !!lessonId,
  });

  // Fetch course details
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => coursesService.getCourseById(Number(id)),
    enabled: !!id,
  });

  // Fetch sections for this course
  const { data: sectionsData, isLoading: sectionsLoading } = useQuery({
    queryKey: [...QUERY_KEYS.sections, "course", id],
    queryFn: () => sectionsService.getSectionsByCourse(Number(id)),
    enabled: !!id,
  });

  const lesson = lessonData?.data;
  const course = courseData?.data;
  const sections = sectionsData?.data || [];
  const currentSection =
    sections.find((s) => s.id === Number(sectionId)) || sections[0];

  // Extract video ID from YouTube URL or embed URL
  const extractVideoId = (url: string): string => {
    if (!url) return "";

    // If it's already just an ID (no slash or protocol), return as is
    // YouTube IDs are typically 10-11 characters
    if (!url.includes("/") && !url.includes("?") && !url.includes("http")) {
      return url;
    }

    // Extract from embed URL: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) return embedMatch[1];

    // Extract from watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return watchMatch[1];

    // Extract from youtu.be URL: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return shortMatch[1];

    // If no pattern matches, return the original string
    return url;
  };

  // Populate form data when lesson loads
  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || "",
        type: lesson.content_type === "VIDEO" ? "VIDEO" : "ARTICLE",
        duration_minutes: lesson.duration_minutes || 0,
        content_url: extractVideoId(lesson.content_url || ""),
        content_text: lesson.content_text || "",
      });
    }
  }, [lesson]);

  const handleInputChange = (field: keyof LessonFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Update lesson mutation
  const updateLessonMutation = useMutation({
    mutationFn: (data: UpdateLessonRequest) =>
      lessonsService.updateLesson(Number(lessonId), data),
    onSuccess: () => {
      // Invalidate lessons queries to refresh the list
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.lessons] });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.lessons, "section"],
      });
      // Navigate back to lessons page after update
      navigate(`/dashboard/mentor/courses/${id}/sections/${sectionId}/lessons`);
    },
    onError: (error) => {
      console.error("Failed to update lesson:", error);
      // TODO: Show error toast
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      return;
    }

    const lessonData: UpdateLessonRequest = {
      title: formData.title,
      content_type: formData.type,
      duration_minutes:
        formData.duration_minutes > 0 ? formData.duration_minutes : undefined,
    };

    // Add content based on type
    if (formData.type === "VIDEO" && formData.content_url) {
      lessonData.content_url = formData.content_url;
    } else if (formData.type === "ARTICLE" && formData.content_text) {
      lessonData.content_text = formData.content_text;
    }

    updateLessonMutation.mutate(lessonData);
  };

  const handleCancel = () => {
    navigate(`/dashboard/mentor/courses/${id}/sections/${sectionId}/lessons`);
  };

  if (lessonLoading || courseLoading || sectionsLoading) {
    return (
      <PermissionRoute requiredPermission="lessons.update">
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

  if (lessonError || !lesson || !course) {
    return (
      <PermissionRoute requiredPermission="lessons.update">
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
                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/mentor/courses/${id}/sections/${sectionId}/lessons`
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to lessons
                </button>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute requiredPermission="lessons.update">
      <Layout>
        <Header
          title="Edit Lesson"
          subtitle={
            currentSection
              ? `Update lesson in Section No. ${currentSection.order_index} - ${currentSection.title}`
              : "Update lesson content"
          }
          backButton={{
            onClick: () =>
              navigate(
                `/dashboard/mentor/courses/${id}/sections/${sectionId}/lessons`
              ),
            label: "Back",
          }}
        />
        <main className="main-content flex-1 overflow-auto p-5">
          {/* Section Header */}
          <div className="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-6">
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-16 bg-orange-50 rounded-[16px] flex items-center justify-center">
                  <Layers className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-brand-dark text-3xl font-extrabold">
                    {currentSection?.title || "Section"}
                  </h1>
                  <span className="px-3 py-1 rounded-md text-sm font-semibold bg-[#FEF3C7] text-[#92400E]">
                    Section No. {currentSection?.order_index || 1}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-base text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Editing lesson</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Lesson No. {lesson.order_index || 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{lesson.content_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Updating content</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Lesson Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Lesson Type Selection */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-[12px] flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-brand-dark text-xl font-bold">
                    Lesson Type
                  </h3>
                  <p className="text-brand-light text-sm font-normal">
                    Choose the type of content for this lesson
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Video Option */}
                <label
                  className={`group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border p-4 transition-all duration-300 cursor-pointer ${
                    formData.type === "VIDEO"
                      ? "border-[#0C51D9] ring-2 ring-[#0C51D9] ring-offset-2"
                      : "border-[#DCDEDD] hover:border-[#0C51D9]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-[12px] flex items-center justify-center">
                      <Video className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-brand-dark text-base font-semibold">
                        Video
                      </p>
                      <p className="text-brand-light text-sm">
                        YouTube video content
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2">
                    <input
                      type="radio"
                      name="lessonType"
                      value="VIDEO"
                      checked={formData.type === "VIDEO"}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value as LessonType)
                      }
                      className="hidden"
                    />
                    <div
                      className={`flex size-[18px] rounded-full shadow-sm border transition-all duration-300 ${
                        formData.type === "VIDEO"
                          ? "border-[5px] border-[#0C51D9]"
                          : "border-[#DCDEDD]"
                      }`}
                    ></div>
                    <p className="text-xs font-semibold">
                      {formData.type === "VIDEO" ? "Selected" : "Select"}
                    </p>
                  </div>
                </label>

                {/* Article Option */}
                <label
                  className={`group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border p-4 transition-all duration-300 cursor-pointer ${
                    formData.type === "ARTICLE"
                      ? "border-[#0C51D9] ring-2 ring-[#0C51D9] ring-offset-2"
                      : "border-[#DCDEDD] hover:border-[#0C51D9]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-[12px] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-brand-dark text-base font-semibold">
                        Article
                      </p>
                      <p className="text-brand-light text-sm">
                        Written text content
                      </p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center w-fit h-8 shrink-0 rounded-xl border border-[#DCDEDD] py-2 px-3 gap-2">
                    <input
                      type="radio"
                      name="lessonType"
                      value="ARTICLE"
                      checked={formData.type === "ARTICLE"}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value as LessonType)
                      }
                      className="hidden"
                    />
                    <div
                      className={`flex size-[18px] rounded-full shadow-sm border transition-all duration-300 ${
                        formData.type === "ARTICLE"
                          ? "border-[5px] border-[#0C51D9]"
                          : "border-[#DCDEDD]"
                      }`}
                    ></div>
                    <p className="text-xs font-semibold">
                      {formData.type === "ARTICLE" ? "Selected" : "Select"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Lesson Information */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-50 rounded-[12px] flex items-center justify-center">
                  <Edit3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-brand-dark text-xl font-bold">
                    Lesson Information
                  </h3>
                  <p className="text-brand-light text-sm font-normal">
                    Basic lesson details and metadata
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Content Title */}
                <div className="mb-4">
                  <label className="block text-brand-dark text-base font-semibold mb-1">
                    Content Title *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Type className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                      placeholder="Enter lesson title"
                    />
                  </div>
                </div>

                {/* Content Duration */}
                <div className="mb-4">
                  <label className="block text-brand-dark text-base font-semibold mb-1">
                    Content Duration (minutes) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      required
                      min="1"
                      max="999"
                      value={formData.duration_minutes || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue =
                          value === "" ? 0 : parseInt(value, 10) || 0;
                        handleInputChange("duration_minutes", numValue);
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                      placeholder="e.g. 15"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Content Section */}
            {formData.type === "VIDEO" && (
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-50 rounded-[12px] flex items-center justify-center">
                    <Youtube className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">
                      Video Content
                    </h3>
                    <p className="text-brand-light text-sm font-normal">
                      YouTube video configuration
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-brand-dark text-base font-semibold mb-1">
                    YouTube Video URL or ID *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.content_url || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Extract YouTube ID automatically if it's a URL
                        const extractedId = extractVideoId(value);
                        handleInputChange("content_url", extractedId);
                      }}
                      className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                      placeholder="Paste YouTube URL or enter video ID (e.g. https://www.youtube.com/watch?v=9-poYwCZxDQ)"
                    />
                  </div>
                  <p className="text-brand-light text-xs mt-2">
                    You can paste any YouTube URL and it will automatically
                    extract the video ID
                  </p>
                </div>
              </div>
            )}

            {/* Article Content Section */}
            {formData.type === "ARTICLE" && (
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-50 rounded-[12px] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">
                      Article Content
                    </h3>
                    <p className="text-brand-light text-sm font-normal">
                      Rich text content editor
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-brand-dark text-base font-semibold mb-1">
                    Article Content *
                  </label>
                  <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus-within:border-[#0C51D9] focus-within:border-2 transition-all duration-300 overflow-hidden">
                    <RichTextEditor
                      value={formData.content_text || ""}
                      onChange={(data) =>
                        handleInputChange("content_text", data)
                      }
                      placeholder="Write your article content here..."
                      className="min-h-[400px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form Navigation */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-dark text-sm font-medium">
                    Update Lesson
                  </p>
                  <p className="text-brand-light text-xs font-normal mt-1">
                    Save changes to lesson information
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="border border-[#DCDEDD] rounded-[8px] hover:border-[#0C51D9] hover:border-2 hover:bg-gray-50 transition-all duration-300 px-6 py-3 flex items-center gap-2"
                  >
                    <span className="text-brand-dark text-base font-semibold">
                      Cancel
                    </span>
                  </button>
                  <Button
                    type="submit"
                    disabled={updateLessonMutation.isPending || !formData.title}
                    variant="primary"
                    className="rounded-[8px] px-6 py-3 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      {updateLessonMutation.isPending
                        ? "Updating..."
                        : "Update Lesson"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </Layout>
    </PermissionRoute>
  );
}
