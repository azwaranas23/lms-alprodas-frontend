import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Users,
  Calendar,
} from "lucide-react";
import {
  lessonsService,
  type UpdateLessonRequest,
} from "~/services/lessons.service";
import { coursesService } from "~/services/courses.service";
import { sectionsService } from "~/services/sections.service";
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

export default function EditLessonForm() {
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

  const { isLoading: courseLoading } = useQuery({
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
  // Initialize form data when lesson loads
  useEffect(() => {
    if (lessonData?.data) {
      const lesson = lessonData.data;
      setFormData({
        title: lesson.title || "",
        type: lesson.content_type as LessonType,
        duration_minutes: lesson.duration_minutes || 0,
        content_url: lesson.content_url || "",
        content_text: lesson.content_text || "",
      });
    }
  }, [lessonData]);

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

    const lesson = lessonData?.data;
    if (!lesson) return;

    const updateData: UpdateLessonRequest = {
      title: formData.title,
      content_type: formData.type,
      duration_minutes:
        formData.duration_minutes > 0 ? formData.duration_minutes : undefined,
      order_index: lesson.order_index,
    };

    if (formData.type === "VIDEO" && formData.content_url) {
      updateData.content_url = formData.content_url;
    } else if (formData.type === "ARTICLE" && formData.content_text) {
      updateData.content_text = formData.content_text;
    }

    try {
      await updateLessonMutation.mutateAsync(updateData);
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const lesson = lessonData?.data;
  const sections = sectionsData?.data || [];
  const defaultSection = sections[0];

  if (lessonLoading || courseLoading || sectionsLoading) {
    return (
      <>
        <Header title="Loading..." subtitle="Please wait" />
        <main className="main-content flex-1 overflow-auto p-5">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading lesson...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (lessonError || !lesson) {
    return (
      <>
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
      </>
    );
  }

  const sectionSubtitle = defaultSection
    ? `Section No. ${defaultSection.order_index} - ${defaultSection.title}`
    : "Section No. 1 - Warming Up";

  return (
    <>
      <Header
        title="Edit Lesson"
        subtitle={`Update lesson content for ${sectionSubtitle}`}
        backButton={{
          onClick: () => navigate(`/dashboard/mentor/courses/${id}/lessons`),
          label: "Back",
        }}
      />
      <main className="main-content flex-1 overflow-auto p-5">
        <LessonFormHeader
          title={defaultSection ? defaultSection.title : "Warming Up"}
          orderIndex={defaultSection ? defaultSection.order_index : 2}
          lessonsCount={6}
          durationText="2.5 hours total"
          actionText="Edit lesson"
          metadataList={[
            {
              icon: <Users className="w-4 h-4" />,
              text: "145 students enrolled",
            },
            {
              icon: <Calendar className="w-4 h-4" />,
              text: "Last updated March 18, 2024",
            },
          ]}
        />

        {/* Edit Lesson Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <LessonTypeSelector
            selectedType={formData.type}
            onChange={(type) => handleInputChange("type", type)}
          />

          <LessonFormFields
            formData={formData}
            onChange={handleInputChange}
          />

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
    </>
  );
}
