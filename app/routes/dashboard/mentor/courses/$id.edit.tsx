import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AddCourseLayout } from "~/components/templates/AddCourseLayout";
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";
import { CourseWizardContent } from "~/features/courses/components/CourseWizardContent";
import {
  useCourse,
  useUpdateCourse,
  useUpdateCourseImage,
} from "~/hooks/api/useCourses";
import type { UpdateCourseData } from "~/services/courses.service";
import type { CourseWizardFormData } from "~/types/course-wizard";

export function meta() {
  return [
    { title: "Edit Course - LMS Alprodas" },
    { name: "description", content: "Edit existing course" },
  ];
}

export default function EditMentorCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const updateCourseMutation = useUpdateCourse();
  const uploadImageMutation = useUpdateCourseImage();

  // Fetch course data
  const {
    data: courseData,
    isLoading: isFetching,
    error,
  } = useCourse(Number(id));
  const course = courseData?.data;

  const handleComplete = async (courseData: CourseWizardFormData) => {
    // Transform CourseWizardContent data to API format
    const updateData: UpdateCourseData = {
      title: courseData.name,
      description: courseData.description,
      about: courseData.description,
      tools: courseData.tools,
      key_points: [
        courseData.keyPoint1,
        courseData.keyPoint2,
        courseData.keyPoint3,
        courseData.keyPoint4,
      ].filter((point): point is string => Boolean(point)),
      personas: [
        courseData.targetAudience1,
        courseData.targetAudience2,
        courseData.targetAudience3,
        courseData.targetAudience4,
      ].filter((audience): audience is string => Boolean(audience)),
      subject_id: parseInt(courseData.subject) || course?.subject?.id || 1,
      price: courseData.price,
      status: courseData.availability === "published" ? "PUBLISHED" : "DRAFT",
    };

    // Handle image updates first if any
    const uploadPromises: Promise<void>[] = [];

    if (courseData.mainPhoto) {
      uploadPromises.push(
        new Promise<void>((resolve, reject) => {
          uploadImageMutation.mutate(
            {
              courseId: Number(id),
              imageType: "main",
              imageFile: courseData.mainPhoto!,
            },
            { onSuccess: () => resolve(), onError: reject }
          );
        })
      );
    }

    try {
      // Wait for image uploads to complete
      if (uploadPromises.length > 0) {
        await Promise.allSettled(uploadPromises);
      }

      // Update course data
      updateCourseMutation.mutate(
        { id: Number(id), data: updateData },
        {
          onSuccess: () => {
            navigate("/dashboard/mentor/courses");
          },
          onError: (error: unknown) => {
            console.error("Error updating course:", error);
          },
        }
      );
    } catch (error: any) {
      console.error("Error uploading images:", error);
    }
  };

  // Transform course data to CourseWizard format
  const getInitialData = () => {
    if (!course) return {};

    return {
      name: course.title,
      description: course.description,
      subject: course.subject?.id?.toString() || "",
      tools: course.tools || "",
      price: course.price,
      availability: (course.status?.toUpperCase() === "PUBLISHED"
        ? "published"
        : "draft") as "published" | "draft",
      level: "Beginner", // Default or get from course data
      duration: "10 hours", // Default or get from course data
      requirements: [], // Default or get from course data
      keyPoint1: course.key_points?.[0]?.key_point || "",
      keyPoint2: course.key_points?.[1]?.key_point || "",
      keyPoint3: course.key_points?.[2]?.key_point || "",
      keyPoint4: course.key_points?.[3]?.key_point || "",
      targetAudience1: course.personas?.[0]?.persona || "",
      targetAudience2: course.personas?.[1]?.persona || "",
      targetAudience3: course.personas?.[2]?.persona || "",
      targetAudience4: course.personas?.[3]?.persona || "",
      images: course.images || [],
      mentor: course.mentor
        ? {
            id: course.mentor.id,
            name: course.mentor.name,
            profile: {
              expertise: course.mentor.profile?.expertise,
              avatar: course.mentor.profile?.avatar,
              totalCourses: 0,
              totalStudents: 0,
            },
          }
        : undefined,
    };
  };

  const handleCancel = () => {
    navigate("/dashboard/mentor/courses");
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Course Information";
      case 2:
        return "Course Photos";
      case 3:
        return "Course Details";
      case 4:
        return "Course Price";
      case 5:
        return "Review Summary";
      default:
        return "Edit Course";
    }
  };

  if (isFetching) {
    return (
      <PermissionRoute requiredPermission="courses.update">
        <AddCourseLayout
          currentStep={currentStep}
          stepTitle={getStepTitle(currentStep)}
          mode="edit"
          backTo="/dashboard/mentor/courses"
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading course...</p>
            </div>
          </div>
        </AddCourseLayout>
      </PermissionRoute>
    );
  }

  if (error || !course) {
    return (
      <PermissionRoute requiredPermission="courses.update">
        <AddCourseLayout
          currentStep={currentStep}
          stepTitle={getStepTitle(currentStep)}
          mode="edit"
          backTo="/dashboard/mentor/courses"
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Course not found
              </h3>
              <p className="text-gray-500">
                The course you're looking for doesn't exist or you don't have
                permission to edit it.
              </p>
            </div>
          </div>
        </AddCourseLayout>
      </PermissionRoute>
    );
  }

  return (
    <PermissionRoute requiredPermission="courses.update">
      <AddCourseLayout
        currentStep={currentStep}
        stepTitle={getStepTitle(currentStep)}
        mode="edit"
        backTo="/dashboard/mentor/courses"
      >
        <CourseWizardContent
          onComplete={handleComplete}
          onCancel={handleCancel}
          onStepChange={handleStepChange}
          isLoading={
            updateCourseMutation.isPending || uploadImageMutation.isPending
          }
          mode="edit"
          initialData={getInitialData()}
        />
      </AddCourseLayout>
    </PermissionRoute>
  );
}
