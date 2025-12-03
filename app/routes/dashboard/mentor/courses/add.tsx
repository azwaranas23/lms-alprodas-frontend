import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { CourseWizard } from "~/features/courses/components/CourseWizard";
import { coursesService } from "~/services/courses.service";
import type { CreateCourseData } from "~/services/courses.service";
import { useUser } from "~/hooks/useUser";
import { authService } from "~/services/auth.service";

// Data yang dikirim CourseWizard ke onComplete
export interface WizardCourseData {
  name?: string;
  description?: string;
  about?: string;
  subject?: string; // subject id dalam bentuk string
  tools?: string;
  keyPoint1?: string;
  keyPoint2?: string;
  keyPoint3?: string;
  keyPoint4?: string;
  targetAudience1?: string;
  targetAudience2?: string;
  targetAudience3?: string;
  targetAudience4?: string;
  availability?: "published" | "draft";
  enrollmentToken?: string;
  mainPhoto?: File;
  previewPhoto?: File;
  contentPhoto?: File;
  certificatePhoto?: File;
}

export default function AddMentorCourse() {
  const navigate = useNavigate();
  const { getUser } = useUser() as { getUser?: () => { id: number } | null };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: CreateCourseData) =>
      coursesService.createCourse(payload),
    onSuccess: (course: any) => {
      // Ambil data yang dibutuhkan untuk halaman success
      const successCourse = {
        title: course?.title,
        price: course?.price,
        subjectName: course?.subject?.name,
        mentorName: course?.mentor?.name,
        courseId: course?.id,
        enrollmentToken: course?.enrollment_token,
        description: course?.description,
        about: course?.about,
        tools: course?.tools,
        keyPoints: course?.key_points,
        personas: course?.personas,
        availability: course?.status,
        thumbnailUrl:
          course?.images?.[0]?.image_path || course?.thumbnailUrl || undefined,
      };

      navigate("/dashboard/mentor/courses/success", {
        state: { course: successCourse },
      });
    },
    onError: (error) => {
      console.error("Error creating course:", error);
    },
  });

  const handleComplete = (formData: WizardCourseData) => {
    const user = authService.getUser();
    if (!user) {
      console.error("User not authenticated");
      navigate("/login");
      return;
    }

    const keyPoints = [
      formData.keyPoint1,
      formData.keyPoint2,
      formData.keyPoint3,
      formData.keyPoint4,
    ].filter(Boolean) as string[];

    const personas = [
      formData.targetAudience1,
      formData.targetAudience2,
      formData.targetAudience3,
      formData.targetAudience4,
    ].filter(Boolean) as string[];

    const images: File[] = [];
    if (formData.mainPhoto) images.push(formData.mainPhoto);
    if (formData.previewPhoto) images.push(formData.previewPhoto);
    if (formData.contentPhoto) images.push(formData.contentPhoto);
    if (formData.certificatePhoto) images.push(formData.certificatePhoto);

    const payload: CreateCourseData = {
      title: formData.name ?? "",
      description: formData.description ?? "",
      about: formData.about,
      tools: formData.tools,
      key_points: keyPoints.length ? keyPoints : undefined,
      personas: personas.length ? personas : undefined,
      status: formData.availability === "published" ? "PUBLISHED" : "DRAFT",
      subject_id: Number(formData.subject),
      mentor_id: user.id,
      enrollment_token: formData.enrollmentToken,
      images: images.length ? images : undefined,
    };

    console.log("Creating course with data:", payload);
    mutate(payload);
  };

  const handleCancel = () => {
    navigate("/dashboard/mentor/courses");
  };

  return (
    <CourseWizard
      onComplete={handleComplete}
      onCancel={handleCancel}
      isLoading={isPending}
    />
  );
}
