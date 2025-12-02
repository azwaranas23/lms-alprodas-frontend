import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseWizard } from "~/features/courses/components/CourseWizard";
import {
  coursesService,
  type CreateCourseData,
} from "~/services/courses.service";
import { authService } from "~/services/auth.service";

export function meta() {
  return [
    { title: "Add Course - LMS Alprodas" },
    { name: "description", content: "Create a new course" },
  ];
}

export default function AddMentorCourse() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: (courseData: CreateCourseData) =>
      coursesService.createCourse(courseData),
    onSuccess: () => {
      // Invalidate courses query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      navigate("/dashboard/mentor/courses/success");
    },
    onError: (error: any) => {
      console.error("Error creating course:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create course. Please try again.";
      console.error(errorMessage);
    },
  });

  const handleComplete = async (courseData: any) => {
    try {
      setIsLoading(true);

      const user = authService.getUser();
      if (!user) {
        console.error("User not authenticated");
        navigate("/login");
        return;
      }

      // Transform CourseWizard data to API format
      const createData: CreateCourseData = {
        title: courseData.name,
        description: courseData.description,
        about: courseData.description, // Use description as about for now
        tools: courseData.tools,
        key_points: [
          courseData.keyPoint1,
          courseData.keyPoint2,
          courseData.keyPoint3,
          courseData.keyPoint4,
        ].filter(Boolean),
        personas: [
          courseData.targetAudience1,
          courseData.targetAudience2,
          courseData.targetAudience3,
          courseData.targetAudience4,
        ].filter(Boolean),
        price: courseData.price || 0,
        status: courseData.availability === "published" ? "PUBLISHED" : "DRAFT",
        subject_id: parseInt(courseData.subject) || 1, // Default to 1 if no subject selected
        mentor_id: user.id,
        // Collect all 4 images into array - will be sent as multiple "images" keys
        images: [
          courseData.mainPhoto,
          courseData.previewPhoto,
          courseData.contentPhoto,
          courseData.certificatePhoto,
        ].filter(Boolean) as File[],
      };

      console.log("Creating course with data:", createData);
      createCourseMutation.mutate(createData);
    } catch (error: any) {
      console.error("Error preparing course data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/mentor/courses");
  };

  return (
    <CourseWizard
      onComplete={handleComplete}
      onCancel={handleCancel}
      isLoading={isLoading || createCourseMutation.isPending}
    />
  );
}
