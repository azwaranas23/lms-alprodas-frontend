import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "~/components/templates/Layout";
import { Header } from "~/components/templates/Header";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import {
  BookOpen,
  PlayCircle,
  Video,
  FileText,
  Edit3,
  Type,
  Clock,
  Youtube,
  Link,
  Plus,
  ArrowLeft,
  Users,
  Calendar,
  Layers,
  Hash,
} from "lucide-react";
import { coursesService } from "~/services/courses.service";
import { sectionsService } from "~/services/sections.service";
import { lessonsService } from "~/services/lessons.service";
import type { CreateLessonRequest } from "~/services/lessons.service";
import { RichTextEditor } from "~/components/organisms/RichTextEditor";
import { QUERY_KEYS } from "~/constants/api";
import { Button } from "~/components/atoms/Button";

export function meta() {
  return [
    { title: "Add New Lesson - LMS Alprodas" },
    { name: "description", content: "Create a new lesson for your course" },
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

export default function AddLesson() {
  const { id, sectionId } = useParams();
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
    data: courseData,
    isLoading,
    error,
  } = useQuery({
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

  const sections = sectionsData?.data || [];
  const currentSection =
    sections.find((s) => s.id === Number(sectionId)) || sections[0];

  // Fetch existing lessons for the section to calculate next order_index
  const { data: existingLessonsData, isLoading: existingLessonsLoading } =
    useQuery({
      queryKey: [...QUERY_KEYS.lessons, "section", currentSection?.id],
      queryFn: () => lessonsService.getLessonsBySection(currentSection!.id),
      enabled: !!currentSection?.id,
    });

  const course = courseData?.data;
  const existingLessons = existingLessonsData?.data || [];

  // Calculate next order_index
  const getNextOrderIndex = (): number => {
    if (existingLessons.length === 0) return 1;
    const maxOrder = Math.max(
      ...existingLessons.map((lesson: any) => lesson.order_index || 0)
    );
    return maxOrder + 1;
  };

  const handleInputChange = (field: keyof LessonFormData, value: any) => {
    console.log(`Setting ${field} to:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: (data: CreateLessonRequest) =>
      lessonsService.createLesson(data),
    onSuccess: () => {
      // Invalidate lessons queries to refresh the list
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.lessons] });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.lessons, "section"],
      });
      // Invalidate sections queries to refresh total_lessons count
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.sections] });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.sections, "course", id],
      });
      // Navigate back to lessons page after creation
      navigate(`/dashboard/mentor/courses/${id}/sections/${sectionId}/lessons`);
    },
    onError: (error) => {
      console.error("Failed to create lesson:", error);
      // TODO: Show error toast
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      return;
    }

    // Use section from URL or fallback to current section
    const targetSectionId = Number(sectionId) || currentSection?.id || 1;

    const lessonData: CreateLessonRequest = {
      title: formData.title,
      section_id: targetSectionId,
      content_type: formData.type,
      duration_minutes:
        formData.duration_minutes > 0 ? formData.duration_minutes : undefined,
      order_index: getNextOrderIndex(),
    };

    console.log("Form data before submit:", formData);
    console.log("Lesson data payload:", lessonData);

    // Add content based on type
    if (formData.type === "VIDEO" && formData.content_url) {
      lessonData.content_url = formData.content_url;
    } else if (formData.type === "ARTICLE" && formData.content_text) {
      lessonData.content_text = formData.content_text;
    }

    createLessonMutation.mutate(lessonData);
  };

  const handleCancel = () => {
    navigate(`/dashboard/mentor/courses/${id}/sections/${sectionId}/lessons`);
  };

  if (isLoading || sectionsLoading || existingLessonsLoading) {
    return (
      <PermissionRoute requiredPermission="lessons.create">
        <Layout>
          <Header title="Loading..." subtitle="Please wait" />
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course details...</p>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  if (error || !course) {
    return (
      <PermissionRoute requiredPermission="lessons.create">
        <Layout>
          <Header title="Error" subtitle="Failed to load course" />
          <main className="main-content flex-1 overflow-auto p-5">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Failed to load course
                </h3>
                <p className="text-gray-500">
                  The course could not be loaded. Please try again later.
                </p>
                <button
                  onClick={() => navigate("/dashboard/mentor/courses")}
                  className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to courses
                </button>
              </div>
            </div>
          </main>
        </Layout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute requiredPermission="lessons.create">
      <Layout>
        <Header
          title="Add New Lesson"
          subtitle={
            currentSection
              ? `Create lesson content for Section No. ${currentSection.order_index} - ${currentSection.title}`
              : "Create lesson content"
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
                    <span>{existingLessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {existingLessons.reduce(
                        (total: number, lesson: any) =>
                          total + (lesson.duration_minutes || 0),
                        0
                      )}{" "}
                      min total
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Course section</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Adding new lesson</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add New Lesson Form */}
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
                <label className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
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
                    <div className="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></div>
                    <p className="text-xs font-semibold after:content-['Select'] group-has-[:checked]:after:content-['Selected']"></p>
                  </div>
                </label>

                {/* Article Option */}
                <label className="group card flex items-center justify-between w-full min-h-[60px] rounded-[16px] border border-[#DCDEDD] p-4 has-[:checked]:ring-2 has-[:checked]:ring-[#0C51D9] has-[:checked]:ring-offset-2 transition-all duration-300 cursor-pointer">
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
                    <div className="flex size-[18px] rounded-full shadow-sm border border-[#DCDEDD] group-has-[:checked]:border-[5px] group-has-[:checked]:border-[#0C51D9] transition-all duration-300"></div>
                    <p className="text-xs font-semibold after:content-['Select'] group-has-[:checked]:after:content-['Selected']"></p>
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
                        console.log("Duration input value:", value);
                        const numValue =
                          value === "" ? 0 : parseInt(value, 10) || 0;
                        console.log("Parsed duration value:", numValue);
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
                    YouTube Video ID *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.content_url || ""}
                      onChange={(e) =>
                        handleInputChange("content_url", e.target.value)
                      }
                      className="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300 font-semibold"
                      placeholder="e.g. 9-poYwCZxDQ"
                    />
                  </div>
                  <p className="text-brand-light text-xs mt-2">
                    Enter only the YouTube video ID (e.g. 9-poYwCZxDQ from
                    https://youtube.com/watch?v=9-poYwCZxDQ)
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
                    Create New Lesson
                  </p>
                  <p className="text-brand-light text-xs font-normal mt-1">
                    Fill in the lesson information
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
                    disabled={createLessonMutation.isPending || !formData.title}
                    variant="primary"
                    className="rounded-[8px] px-6 py-3 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-brand-white text-base font-semibold">
                      {createLessonMutation.isPending
                        ? "Creating..."
                        : "Create Lesson"}
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
