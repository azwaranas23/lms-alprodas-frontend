import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { Route } from "./+types/checkout.$id";
import { Navbar } from "~/components/organisms/Navbar";
import { CourseInfoCard } from "~/features/checkout/components/CourseInfoCard";
import { StudentInfoCard } from "~/features/checkout/components/StudentInfoCard";
import { PaymentDetailsCard } from "~/features/checkout/components/PaymentDetailsCard";
import { LoadingSpinner } from "~/components/atoms/LoadingSpinner";
import { Button } from "~/components/atoms/Button";
import { coursesService } from "~/services/courses.service";
import { authService } from "~/services/auth.service";
import { enrollmentService } from "~/services/enrollment.service";
import { getAvatarSrc } from "~/utils/formatters";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Enroll Course - Alprodas LMS" },
    {
      name: "description",
      content: "Enter your course token to enroll in this class",
    },
  ];
}

interface EnrollmentPageData {
  student: {
    name: string;
    email: string;
    avatar: string;
    phone: string;
    location: string;
  };
  course: {
    title: string;
    category: string;
    thumbnail: string;
    lessons: string;
    instructor: string;
    level: string;
  };
}

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<EnrollmentPageData | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // dibaca sekali saja, jangan dijadikan dependency useEffect
  const loggedInUser = authService.getUser();

  useEffect(() => {
    // kalau belum ada id, jangan fetch
    if (!id) {
      setError("Course ID is required");
      setLoading(false);
      return;
    }

    // kalau belum login, langsung redirect
    if (!loggedInUser) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await coursesService.getCourseDetail(Number(id));
        const courseData = response.data;

        if (courseData.is_enrolled) {
          navigate(`/student/${id}/progress`, { replace: true });
          return;
        }

        setCourse(courseData);

        const data: EnrollmentPageData = {
          student: {
            name: loggedInUser?.name || "Student",
            email: loggedInUser?.email || "student@email.com",
            avatar: getAvatarSrc(
              loggedInUser?.avatar || loggedInUser?.user_profile?.avatar,
              loggedInUser?.name
            ),
            phone: loggedInUser?.phone || "-",
            location: "Indonesia",
          },
          course: {
            title: courseData.title,
            category: courseData.subject?.topic?.name || "Course",
            thumbnail: courseData.images?.[0]?.image_path || "",
            lessons: `${courseData.total_lessons} lessons`,
            instructor: courseData.mentor?.name || "Instructor",
            level: "Intermediate",
          },
        };

        setPageData(data);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    // HANYA tergantung id & navigate
  }, [id, navigate]); // <<< loggedInUser dihapus dari deps

  const handleEnrollWithToken = async (token: string) => {
    if (!id) return;
    setIsProcessing(true);

    try {
      await enrollmentService.enrollWithToken({
        course_id: Number(id),
        token,
      });

      // Berhasil enroll → arahkan ke halaman success
      navigate(`/enrollment-success/${id}`, {
        state: {
          courseTitle: course?.title,
        },
      });
    } catch (error: any) {
      console.error("Enrollment failed:", error);
      alert(
        error?.response?.data?.message ||
        "Enrollment failed. Please check your token and try again."
      );
      setIsProcessing(false);
    }
  };

  if (loading || !loggedInUser) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <LoadingSpinner text="Loading enrollment page..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  if (!pageData || !course) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <LoadingSpinner text="Loading enrollment page..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold text-brand-dark">
              Enroll Course
            </h1>
            <p className="text-brand-light text-lg">
              Complete your enrollment by entering the course token
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <CourseInfoCard courseData={pageData.course} />
          </div>

          <div className="space-y-6">
            <StudentInfoCard studentData={pageData.student} />
            <PaymentDetailsCard
              isProcessing={isProcessing}
              onEnroll={handleEnrollWithToken}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
