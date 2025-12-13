import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { Route } from "./+types/payment-success.$id";
import { Receipt, Play } from "lucide-react";
import { Navbar } from "~/components/organisms/Navbar";
import { PurchaseSuccessIcon } from "~/features/checkout/components/PurchaseSuccessIcon";
import { PurchasedCourseCard } from "~/features/checkout/components/PurchasedCourseCard";
import { LoadingSpinner } from "~/components/atoms/LoadingSpinner";
import { Button } from "~/components/atoms/Button";
import { authService } from "~/services/auth.service";
import { coursesService } from "~/services/courses.service";
import { formatCurrency, getAvatarSrc } from "~/utils/formatters";
import { Image } from "~/components/atoms/Image";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Payment Success - Alprodas LMS" },
    {
      name: "description",
      content: "Payment successful! Your course purchase has been completed",
    },
  ];
}
import { PermissionRoute } from "~/features/auth/components/PermissionRoute";

interface PurchaseData {
  course: {
    title: string;
    category: string;
    thumbnail: string;
    studentsEnrolled: string;
    id?: string;
  };
  transaction: {
    id: string;
    purchaseDate: string;
  };
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export default function PurchaseSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get logged-in user data
  const loggedInUser = authService.getUser();

  useEffect(() => {
    const fetchCourseAndCheckEnrollment = async () => {
      if (!id) {
        setError("Course ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await coursesService.getCourseById(Number(id));
        const courseData = response.data;

        // Check if user is enrolled
        if (!courseData.is_enrolled) {
          setError("You are not enrolled in this course");
          setLoading(false);
          return;
        }

        setCourse(courseData);

        // Create purchase data from course
        const purchaseData: PurchaseData = {
          course: {
            title: courseData.title,
            category: courseData.subject?.topic?.name || "Course",
            thumbnail: courseData.images?.[0]?.image_path || "",
            studentsEnrolled: `${courseData.total_students} students enrolled`,
            id: courseData.id.toString(),
          },
          transaction: {
            id:
              "TRX-" +
              new Date().getFullYear() +
              "-" +
              Math.random().toString().substring(2, 8),
            purchaseDate: "Purchased just now",
          },
          user: {
            name: loggedInUser?.name || "Student",
            email: loggedInUser?.email || "student@email.com",
            avatar: getAvatarSrc(
              loggedInUser?.avatar || loggedInUser?.user_profile?.avatar,
              loggedInUser?.name
            ),
          },
        };

        setPurchaseData(purchaseData);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndCheckEnrollment();
  }, [id]);

  const handleStartLearning = () => {
    if (!purchaseData || !id) return;

    // Redirect to course progress page
    navigate(`/student/${id}/progress`);
  };

  const handleViewReceipt = () => {
    if (!purchaseData) return;

    // Redirect to transaction details page
    alert(`Redirecting to transaction details: ${purchaseData.transaction.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <LoadingSpinner text="Loading purchase details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/dashboard/student/my-courses")}>
            Go to My Courses
          </Button>
        </div>
      </div>
    );
  }

  if (!purchaseData || !course) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <LoadingSpinner text="Loading purchase details..." />
      </div>
    );
  }

  return (
    <PermissionRoute>
      <div className="min-h-screen bg-[#F9F9F9]">
        <Navbar />

        {/* Success Content */}
        <main className="min-h-screen flex items-center justify-center py-12">
          <div className="max-w-2xl mx-auto px-6 text-center">
            {/* Success Icon */}
            <PurchaseSuccessIcon />

            {/* Success Message */}
            <div className="mb-12">
              <h1 className="text-brand-dark text-4xl font-extrabold mb-4">
                Congratulations! 🎉
              </h1>
              <p className="text-brand-light text-lg font-normal">
                Your course purchase was successful! You now have full access to
                all course materials and can start learning immediately.
              </p>
            </div>

            {/* Course Info Card */}
            <PurchasedCourseCard
              courseData={{
                title: purchaseData.course.title,
                category: purchaseData.course.category,
                thumbnail: purchaseData.course.thumbnail,
                studentsEnrolled: purchaseData.course.studentsEnrolled,
                purchaseDate: purchaseData.transaction.purchaseDate,
              }}
            />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                variant="outline"
                onClick={handleViewReceipt}
                className="rounded-[12px] px-8 py-4"
              >
                <Receipt className="w-5 h-5 text-gray-600" />
                View Receipt
              </Button>
              <Button
                onClick={handleStartLearning}
                className="rounded-[12px] px-8 py-4"
              >
                <Play className="w-5 h-5 text-white" />
                Start Learning Now
              </Button>
            </div>
          </div>
        </main>
      </div>
    </PermissionRoute>
  );
}
