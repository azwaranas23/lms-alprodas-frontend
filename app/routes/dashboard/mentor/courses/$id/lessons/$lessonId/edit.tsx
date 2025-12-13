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
} from "lucide-react";
import {
  lessonsService,
  type UpdateLessonRequest,
} from "~/services/lessons.service";
import { coursesService } from "~/services/courses.service";
import { sectionsService } from "~/services/sections.service";
import { QUERY_KEYS } from "~/constants/api";
import { Button } from "~/components/atoms/Button";

export function meta() {
  return [
    { title: "Edit Lesson - Alprodas LMS" },
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
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    type: "VIDEO",
    duration_minutes: 0,
    content_url: "",
    content_text: "",
  });

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

  const { data: sectionsData, isLoading: sectionsLoading } = useQuery({
    queryKey: [...QUERY_KEYS.sections, "course", id],
    queryFn: () => sectionsService.getSectionsByCourse(Number(id)),
    enabled: !!id,
  });

  const updateLessonMutation = useMutation({
    mutationFn: (data: UpdateLessonRequest) =>
      lessonsService.updateLesson(Number(lessonId), data),
    onSuccess: () => {
      // Invalidate all lesson-related queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.lessons] });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.lessons, "section"],
      });
      navigate(`/dashboard/mentor/courses/${id}/lessons`);
    },
    onError: (error) => {
      console.error("Failed to update lesson:", error);
    },
  });

  // Function to extract YouTube video ID from URL if needed
  const extractYouTubeId = (url: string): string => {
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

  // Initialize form data when lesson loads
  useEffect(() => {
    if (lessonData?.data) {
      const lesson = lessonData.data;
      setFormData({
        title: lesson.title || "",
        type: lesson.content_type as LessonType,
        duration_minutes: lesson.duration_minutes || 0,
        content_url: extractYouTubeId(lesson.content_url || ""),
        content_text: lesson.content_text || "",
      });
    }
  }, [lessonData]);

  // Initialize CKEditor when component mounts and content type is ARTICLE
  useEffect(() => {
    if (formData.type === "ARTICLE" && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src =
        "https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js";
      script.onload = () => {
        if ((window as any).ClassicEditor) {
          const editorElement = document.querySelector(
            "#editor"
          ) as HTMLElement;
          if (editorElement && !(editorElement as any).ckeditorInstance) {
            (window as any).ClassicEditor.create(editorElement)
              .then((editor: any) => {
                (editorElement as any).ckeditorInstance = editor;
                editor.setData(formData.content_text || "");
                editor.model.document.on("change:data", () => {
                  handleInputChange("content_text", editor.getData());
                });
              })
              .catch((error: any) => console.error(error));
          }
        }
      };
      document.head.appendChild(script);
    }
  }, [formData.type]);

  const handleInputChange = (
    field: keyof LessonFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
      order_index: lesson.order_index, // Preserve existing order
    };

    // Add content based on type
    if (formData.type === "VIDEO" && formData.content_url) {
      lessonData.content_url = formData.content_url;
    } else if (formData.type === "ARTICLE" && formData.content_text) {
      lessonData.content_text = formData.content_text;
    }

    try {
      await updateLessonMutation.mutateAsync(lessonData);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const lesson = lessonData?.data;
  const course = courseData?.data;
  const sections = sectionsData?.data || [];
  const defaultSection = sections[0];

  if (lessonLoading || courseLoading || sectionsLoading) {
    return (
      <PermissionRoute>
        <Layout>
          <Header title="Loading..." subtitle="Please wait" />
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading lesson...</p>
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
                <button
                  onClick={() =>
                    navigate(`/dashboard/mentor/courses/${id}/lessons`)
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
    <PermissionRoute>
      <Layout>
        <Header
          title="Edit Lesson"
          subtitle={`Update lesson content for ${defaultSection ? `Section No. ${defaultSection.order_index} - ${defaultSection.title}` : "Section No. 1 - Warming Up"}`}
          backButton={{
            onClick: () => navigate(`/dashboard/mentor/courses/${id}/lessons`),
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
                    {defaultSection ? defaultSection.title : "Warming Up"}
                  </h1>
                  <span className="px-3 py-1 rounded-md text-sm font-semibold bg-[#FEF3C7] text-[#92400E]">
                    Section No.{" "}
                    {defaultSection ? defaultSection.order_index : 2}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-base text-gray-600">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>6 lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>2.5 hours total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>145 students enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Last updated March 18, 2024</span>
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
                  className={`group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border p-4 transition-all duration-300 cursor-pointer ${formData.type === "VIDEO"
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
                      className={`flex size-[18px] rounded-full shadow-sm border transition-all duration-300 ${formData.type === "VIDEO"
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
                  className={`group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border p-4 transition-all duration-300 cursor-pointer ${formData.type === "ARTICLE"
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
                      className={`flex size-[18px] rounded-full shadow-sm border transition-all duration-300 ${formData.type === "ARTICLE"
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

              <div className="grid grid-cols-2 gap-6">
                {/* Lesson Title */}
                <div>
                  <label className="text-brand-dark text-base font-semibold mb-3 block">
                    Lesson Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full pl-4 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                    placeholder="Enter lesson title"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="text-brand-dark text-base font-semibold mb-3 block">
                    Duration (Minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="999"
                    value={formData.duration_minutes || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange(
                        "duration_minutes",
                        value === "" ? 0 : parseInt(value) || 0
                      );
                    }}
                    className="w-full pl-4 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                    placeholder="e.g. 15"
                  />
                </div>
              </div>
            </div>

            {/* Conditional Content Fields */}
            {formData.type === "VIDEO" && (
              <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-50 rounded-[12px] flex items-center justify-center">
                    <Video className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-brand-dark text-xl font-bold">
                      Video Content
                    </h3>
                    <p className="text-brand-light text-sm font-normal">
                      Add your YouTube video URL
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-brand-dark text-base font-semibold mb-3 block">
                    YouTube Video URL or ID
                  </label>
                  <input
                    type="text"
                    value={formData.content_url || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Extract YouTube ID automatically if it's a URL
                      const extractedId = extractYouTubeId(value);
                      handleInputChange("content_url", extractedId);
                    }}
                    className="w-full pl-4 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                    placeholder="Paste YouTube URL or enter video ID (e.g. https://www.youtube.com/watch?v=9-poYwCZxDQ)"
                  />
                  <p className="text-brand-light text-xs mt-2">
                    You can paste any YouTube URL and it will automatically
                    extract the video ID
                  </p>
                </div>
              </div>
            )}

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
                      Write your lesson content
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-brand-dark text-base font-semibold mb-3 block">
                    Lesson Content
                  </label>
                  <div className="border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus-within:border-[#0C51D9] focus-within:border-2 transition-all duration-300 overflow-hidden">
                    <div id="editor" style={{ minHeight: "200px" }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="bg-white border border-[#DCDEDD] rounded-[20px] p-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/dashboard/mentor/courses/${id}/lessons`)
                  }
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
          </form>
        </main>
      </Layout>
    </PermissionRoute>
  );
}
