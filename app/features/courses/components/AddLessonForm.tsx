import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { coursesService } from "~/services/courses.service";
import { sectionsService } from "~/services/sections.service";
import { lessonsService } from "~/services/lessons.service";
import type { CreateLessonRequest } from "~/services/lessons.service";
import { QUERY_KEYS } from "~/constants/api";
import { Button } from "~/components/atoms/Button";
import { Header } from "~/components/templates/Header";
import { LessonFormHeader } from "./LessonFormHeader";
import { LessonTypeSelector } from "./LessonTypeSelector";
import { LessonFormFields } from "./LessonFormFields";

type LessonType = "VIDEO" | "ARTICLE";

interface LessonFormData {
  title: string;
  type: LessonType;
  duration_minutes: number;
  content_url?: string;
  content_text?: string;
}

export default function AddLessonForm() {
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
      const backUrl = sectionId 
        ? `/dashboard/mentor/courses/${id}/sections/${sectionId}/lessons`
        : `/dashboard/mentor/courses/${id}/lessons`;
      navigate(backUrl);
    },
    onError: (error) => {
      console.error("Failed to create lesson:", error);
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
    const backUrl = sectionId 
      ? `/dashboard/mentor/courses/${id}/sections/${sectionId}/lessons`
      : `/dashboard/mentor/courses/${id}/lessons`;
    navigate(backUrl);
  };

  if (isLoading || sectionsLoading || existingLessonsLoading) {
    return (
      <>
        <Header title="Loading..." subtitle="Please wait" />
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course details...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      <Header
        title="Add New Lesson"
        subtitle={
          currentSection
            ? `Create lesson content for Section No. ${currentSection.order_index} - ${currentSection.title}`
            : "Create lesson content"
        }
        backButton={{
          onClick: handleCancel,
          label: "Back",
        }}
      />
      <main className="main-content flex-1 overflow-auto p-5">
        <LessonFormHeader
          title={currentSection?.title || "Section"}
          orderIndex={currentSection?.order_index || 1}
          lessonsCount={existingLessons.length}
          durationText={`${existingLessons.reduce((total: number, lesson: any) => total + (lesson.duration_minutes || 0), 0)} min total`}
          actionText="Adding new lesson"
        />

        {/* Add New Lesson Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <LessonTypeSelector
            selectedType={formData.type}
            onChange={(type) => handleInputChange("type", type)}
          />

          <LessonFormFields
            formData={formData}
            onChange={handleInputChange}
          />

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
    </>
  );
}
